import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ImportTransactionsService } from '@domains/transactions/services/ImportTransactionsService';

export class ImportFilesController {
  public async create(request: Request, response: Response): Promise<Response> {
    try {
      const { path } = request.file;
      const user_id = request.user.id;

      const importTransactions = container.resolve(ImportTransactionsService);

      const transactions = await importTransactions.execute({
        filePath: path,
        user_id,
      });

      return response.status(200).json(transactions);
    } catch (err) {
      console.log(err);
      return response
        .status(400)
        .json({ message: err.message, status: 'error' });
    }
  }
}
