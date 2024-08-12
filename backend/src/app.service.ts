import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import * as fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

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
      return new Promise((resolve) => {
        exec(`npx ts-node ${tempFilePath}`, (e, stdout, stdErr) => {
          if (e) {
            resolve({ stdErr });
          } else {
            resolve({ stdout });
          }
        });
      });
    } catch (e) {
      console.error(e);
    } finally {
      // await this.removeTempFile(tempFilePath);
    }
  }
}
