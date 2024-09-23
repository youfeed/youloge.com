import path from 'path'
import fs  from 'fs'
/**
 * 构建后重命名html
**/
export const copyFile = (options)=>{
  return {
    name: 'vite-plugin-copy-file', 
    apply: 'build',
    closeBundle:()=>{
      options.targets.forEach(({src,dest})=>{
        const oldPath = path.resolve(process.cwd(), src);
        const newPath = path.resolve(process.cwd(), dest);
        fs.promises.cp(oldPath, newPath);
      })

    }
  }
}
/**
 * 构建后重命名html
**/
export const renameHTML = (options)=>{
    return {
      name: 'vite-plugin-rename-html', 
      apply: 'build',
      closeBundle: () => {
        const distPath = path.resolve(process.cwd(), 'dist');
        const pagePath = path.resolve(process.cwd(), 'dist/pages');
        // // 读取输出目录中的所有文件和文件夹
        try {
          const files = fs.readdirSync(pagePath, { withFileTypes: false });
          files.forEach((name) =>{
            const oldPath = path.join(pagePath, `${name}/index.html`);
            const newPath = path.join(distPath, (name=='index' ? 'index.html' : name));
            fs.renameSync(oldPath, newPath);
            console.log(`${name}/index.html => ${name}`);
          });
          // 移除page
          fs.rmSync(pagePath, { recursive: true,force: true });
          console.log(`================ rmdir pages ================`);
        } catch (error) {
          console.log('pages not found')
        }
      }
    }
  }