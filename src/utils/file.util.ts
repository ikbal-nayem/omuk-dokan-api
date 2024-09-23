import fs from 'fs';

export const createDirIfNotExists = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
};

export const deleteDir = (dir: string) => {
  if (fs.existsSync(dir)) {
    fs.rmdirSync(dir, { recursive: true });
  }
};

export const deleteFile = (filePath: string) => {
  if (fs.existsSync(filePath)) {
    console.log('Deleting file -> ' + filePath);
    fs.unlinkSync(filePath);
  }
};
