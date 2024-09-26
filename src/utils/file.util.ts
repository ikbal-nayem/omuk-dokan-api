import fs from 'fs';
import path from 'path';

export const createDirIfNotExists = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  return dir;
};

export const moveFiles = (destination: string, sources: string | string[]): string | Array<string> => {
  if (typeof sources === 'string') sources = [sources];
  const newPath = path.join(process.env.MEDIA_ROOT!, destination);
  createDirIfNotExists(newPath);
  const newLocations: string[] = [];
  sources.forEach((file) => {
    const newLocation = path.join(newPath, path.basename(file));
    fs.rename(file, newLocation, (err) => {
      if (err) console.log(err);
    });
    console.log(file, ' => ', newLocation);
    newLocations.push(newLocation);
  });
  return typeof sources === 'string' ? newLocations[0] : newLocations;
};

export const deleteDir = (dir: string) => {
  if (fs.existsSync(dir)) {
    fs.rmdirSync(dir, { recursive: true });
  }
};

export const deleteFiles = (filePaths: string | string[]) => {
  if (typeof filePaths === 'string') filePaths = [filePaths];
  filePaths.forEach((file) => {
    if (fs.existsSync(file)) {
      console.log('Deleting file -> ' + file);
      fs.unlinkSync(file);
    }
  });
};
