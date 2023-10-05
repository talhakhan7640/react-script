const { exec } = require("node:child_process");
const path = require("path");
const fs = require("node:fs/promises");
const prompt = require("prompt-sync")({ signal: true });

const appName = prompt("Enter application name: ");
console.log("Creating new react app with name:", appName);

const openWithVSCode = () => {
  const directory = path.join(__dirname, appName);
  exec(`"code" ${directory}`, (error, stdout, stderr) => {
    if (error) {
      console.log(`exec error: ${error}`);
      return;
    } else {
      console.log(`stdout: ${stdout}`);
    }
  });
};

const createNewFilesAndFolders = async (directoryPath) => {
  try {
    const createdComponent = await fs.mkdir(directoryPath + "/components", {
      recursive: true,
    });
    const createdAssets = await fs.mkdir(directoryPath + "/assets", {
      recursive: true,
    });
    const createdStyle = await fs.mkdir(directoryPath + "/assets" + "/styles", {
      recursive: true,
    });
    const createdImages = await fs.mkdir(
      directoryPath + "/assets" + "/images",
      {
        recursive: true,
      }
    );
    console.log(`successfully created ${createdComponent}`);
    console.log(`successfully created ${createdAssets}`);
    console.log(`successfully created ${createdStyle}`);
    console.log(`successfully created ${createdImages}`);
  } catch (err) {
    console.log(err.message);
  }

  // Copying our own files in the project directory.
  const sourceOfIndexFile = path.join(
    directoryPath,
    "../../reactFolderStructure/reactIndex.js"
  );
  const destinationOfIndexFile = path.join(directoryPath, "index.js");
  await fs.copyFile(sourceOfIndexFile, destinationOfIndexFile);

  const sourceOfAppFile = path.join(
    directoryPath,
    "../../reactFolderStructure/reactApp.js"
  );
  const destinationOfAppFile = path.join(directoryPath, "App.js");
  await fs.copyFile(sourceOfAppFile, destinationOfAppFile);

  const sourceOfPackge = path.join(
    directoryPath,
    "../../reactFolderStructure/package.json"
  );
  const destinationOfPackge = path.join(directoryPath, "../", "package.json");
  await fs.copyFile(sourceOfPackge, destinationOfPackge);

  openWithVSCode();
};

const removeUnwantedFiles = (filePath) => {
  console.log("Removing unwanted files....");
  exec(`"cd" ${filePath}`, async (error, stdout, stderr) => {
    if (error) {
      console.log(`exec error: ${error}`);
      return;
    } else {
      const appTest = Promise.resolve(
        fs.rm(path.join(filePath, "App.test.js"))
      );
      const appCss = Promise.resolve(fs.rm(path.join(filePath, "App.css")));
      const reportWebVitals = Promise.resolve(
        fs.rm(path.join(filePath, "reportWebVitals.js"))
      );
      const setupTests = Promise.resolve(
        fs.rm(path.join(filePath, "setupTests.js"))
      );
      const logo = Promise.resolve(fs.rm(path.join(filePath, "logo.svg")));
      const index = Promise.resolve(fs.rm(path.join(filePath, "index.js")));
      const app = Promise.resolve(fs.rm(path.join(filePath, "App.js")));
      const package = Promise.resolve(fs.rm(filePath, "../package.json"));

      const promises = [
        appTest,
        appCss,
        reportWebVitals,
        setupTests,
        logo,
        index,
        app,
        package,
      ];
      Promise.allSettled(promises).then(() =>
        createNewFilesAndFolders(filePath)
      );
    }
  });
};

const runCommand = (appName) => {
  exec(`"npx" create-react-app ${appName} -y`, (error, stdout, stderr) => {
    if (error) {
      console.log(`exec error: ${error}`);
      return;
    } else {
      console.log(`stdout: ${stdout}`);
      var filesDirectoryPath = path.join(__dirname, appName, "/src");
      removeUnwantedFiles(filesDirectoryPath);
    }
  });
};

const forReactApp = runCommand(appName);
forReactApp;
