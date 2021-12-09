import {resolve} from "path";
import {promises} from "fs";


export async function iterateDir(
    dir:string, 
    onNewDir: (dir: string, direntName:string) => void, 
    onFile: (dir: string, direntName:string) => void):Promise<void> {

  const dirents = await promises.readdir(dir, { withFileTypes: true });

    await Promise.all(dirents.map((dirent) => {
    const res = resolve(dir, dirent.name);

    if(dirent.isDirectory()){
        onNewDir(dir, dirent.name)
        return iterateDir(res, onNewDir, onFile);
    }

    onFile(dir, dirent.name);
    return Promise.resolve();
  }));

}