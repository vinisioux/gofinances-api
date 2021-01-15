import { getRepository, Repository } from 'typeorm';

import Transaction from '@modules/transactions/infra/typeorm/entities/Transaction';
import {
  ITransactionRepository,
  IBalance,
} from '@modules/transactions/repositories/ITransactionRepository';
import ICreateTransactionDTO from '@modules/transactions/dtos/ICreateTransactionDTO';

class TransactionsRepository implements ITransactionRepository {
  private ormRepository: Repository<Transaction>;

  constructor() {
    this.ormRepository = getRepository(Transaction);
  }

  public async getBalance(): Promise<IBalance> {
    let income = 0;
    let outcome = 0;

    const values = await this.ormRepository.find();

    for (let i = 0; i < values.length; i += 1) {
      const transaction = values[i];

      if (transaction.type === 'income') {
        income += transaction.value;
      }

      if (transaction.type === 'outcome') {
        outcome += transaction.value;
      }
    }

    const balance = {
      income,
      outcome,
      total: income - outcome,
    };

    return balance;
  }

  public async create({
    title,
    category_id,
    type,
    value,
  }: ICreateTransactionDTO): Promise<Transaction> {
    const transaction = this.ormRepository.create({
      title,
      category_id,
      type,
      value,
    });

    await this.ormRepository.save(transaction);

    return transaction;
  }

  public async getAllTransactions(): Promise<Transaction[]> {
    const transactions = await this.ormRepository.find();

    return transactions;
  }
}

export default TransactionsRepository;
