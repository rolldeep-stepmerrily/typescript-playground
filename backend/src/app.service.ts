import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { transformSync } from '@swc/core';
import { runInNewContext } from 'vm';

@Injectable()
export class AppService {
  async createTempFile(code: string) {
    const fileName = `${uuidv4()}.ts`;
    const filePath = path.join(__dirname, '../../temp', fileName);

    await fs.writeFile(filePath, code);

    return filePath;
  }

  async removeTempFile(filePath: string) {
    try {
      await fs.unlink(filePath);
    } catch (e) {
      console.error(e);
    }
  }

  async runTypescript(code: string) {
    const tempFilePath = await this.createTempFile(code);

    try {
      const file = await fs.readFile(tempFilePath, 'utf-8');

      const { code } = transformSync(file, {
        jsc: { parser: { syntax: 'typescript' }, target: 'es2021' },
        module: { type: 'commonjs' },
      });

      let output = '';

      const context = {
        console: {
          log: (...args: any) => {
            output += args.join(' ') + '\n';
          },
        },
      };

      runInNewContext(code, context);

      return { stdout: output };
    } catch (e) {
      console.error(e);
    } finally {
      await this.removeTempFile(tempFilePath);
    }
  }
}
