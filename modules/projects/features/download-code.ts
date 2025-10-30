import { Sandbox } from "@e2b/code-interpreter";
import fs from "fs";
import path from "path";

const sandboxId = "sandboxId here";
const apiKey = process.env.E2B_API_KEY;
const localDownloadDir = "./my_project_files";
const sandboxBaseDir = "/home/user";

async function downloadAndPause() {
  let sandbox: Sandbox | undefined;
  try {
    console.log(`Connecting to sandbox ${sandboxId}...`);
    sandbox = await Sandbox.connect(sandboxId, {
      apiKey: apiKey,
    });

    console.log(
      `Listing all files in ${sandboxBaseDir} (ignoring node_modules)...`
    );

    const findCommand = `find ${sandboxBaseDir} -name "node_modules" -prune -o -type f`;

    console.log(`Running: ${findCommand}`);
    const execution = await sandbox.commands.run(findCommand);

    if (execution.stderr) {
      throw new Error(`Error listing files: ${execution.stderr}`);
    }

    const allFilePaths = execution.stdout.split("\n").filter(Boolean);
    console.log(
      `Found ${allFilePaths.length} files (node_modules skipped). Starting download...`
    );

    for (const sandboxPath of allFilePaths) {
      if (!sandboxPath) continue;

      try {
        const content = await sandbox.files.read(sandboxPath);

        const relativePath = path.relative(sandboxBaseDir, sandboxPath);

        if (relativePath.includes("node_modules")) {
          continue;
        }

        const localFilePath = path.join(localDownloadDir, relativePath);

        const localDir = path.dirname(localFilePath);
        if (!fs.existsSync(localDir)) {
          fs.mkdirSync(localDir, { recursive: true });
        }

        fs.writeFileSync(localFilePath, content);
        console.log(`Downloaded: ${localFilePath}`);
      } catch (fileError: any) {
        console.warn(
          `Could not download file ${sandboxPath}: ${fileError.message}`
        );
      }
    }

    console.log(`\n✅ All files downloaded to ${localDownloadDir}`);

    console.log("Pausing sandbox...");
    await sandbox.betaPause();

    console.log(`✅ Sandbox ${sandboxId} has been successfully paused.`);
  } catch (error: any) {
    console.error(`Operation failed: ${error.message}`);

    if (sandbox) {
      console.log("Error occurred, killing sandbox to prevent costs...");
      await sandbox.kill();
    }
  }
}

downloadAndPause();
