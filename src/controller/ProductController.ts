import { Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { TypeORMError } from 'typeorm';
import { Product } from '../model/Product';
import { Representation } from '../model/Representation';
import { IProduct } from '../entity/Product';

export class ProductController {
  async index(req: Request, res: Response) {
    const runner = AppDataSource.createQueryRunner();
    try {
      await runner.connect();
      const products = await new Product().find(runner);
      await runner.release();
      const response = [];
      for (const product of products) response.push(product.toAttributes);

      return res.json(response);
    } catch (e) {
      console.error(e);
      return res.status(400).json((e as TypeORMError).message);
    }
  }

  async show(req: Request, res: Response) {
    const id = Number.parseInt(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json('parâmetro incorreto.');

    const runner = AppDataSource.createQueryRunner();
    try {
      await runner.connect();
      const product = await new Product().findOne(runner, id);
      await runner.release();

      return res.json(product ? product.toAttributes : undefined);
    } catch (e) {
      console.error(e);
      return res.status(400).json((e as TypeORMError).message);
    }
  }

  async store(req: Request, res: Response) {
    if (Object.keys(req.body).length == 0)
      return res.status(400).json('requisição sem corpo.');

    const payload = req.body;

    const runner = AppDataSource.createQueryRunner();
    try {
      await runner.connect();

      const representation = (await new Representation().findOne(
        runner,
        payload.product.representation,
      )) as Representation;
      const product: IProduct = {
        id: 0,
        description: payload.product.description,
        measure: payload.product.measure,
        weight: payload.product.weight,
        price: payload.product.price,
        priceOut: payload.product.priceOut,
        types: payload.product.types,
        representation: representation.toAttributes,
      };

      const model = new Product(product);

      await runner.startTransaction();
      const response = await model.save(runner);
      if (response.length > 0) {
        await runner.rollbackTransaction();
        await runner.release();
        return res.status(400).json(response);
      }
      await runner.commitTransaction();
      await runner.release();

      return res.json(response);
    } catch (e) {
      console.error(e);
      return res.status(400).json((e as TypeORMError).message);
    }
  }

  async update(req: Request, res: Response) {
    const id = Number.parseInt(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json('parâmetro incorreto.');

    if (Object.keys(req.body).length == 0)
      return res.status(400).json('requisição sem corpo.');

    const payload = req.body;

    const runner = AppDataSource.createQueryRunner();
    try {
      await runner.connect();

      const product = await new Product().findOne(runner, id);
      if (!product) {
        await runner.release();
        return res.status(400).json('produto não cadastrado.');
      }

      const representation = (await new Representation().findOne(
        runner,
        payload.product.representation,
      )) as Representation;

      product.description = payload.product.description;
      product.measure = payload.product.measure;
      product.weight = payload.product.weight;
      product.price = payload.product.price;
      product.priceOut = payload.product.priceOut;
      product.types = payload.product.types;
      product.representation = representation.toAttributes;

      await runner.startTransaction();
      const response = await product.update(runner);
      if (response.length > 0) {
        await runner.rollbackTransaction();
        await runner.release();
        return res.status(400).json(response);
      }
      await runner.commitTransaction();
      await runner.release();

      return res.json(response);
    } catch (e) {
      console.error(e);
      return res.status(400).json((e as TypeORMError).message);
    }
  }

  async delete(req: Request, res: Response) {
    const id = Number.parseInt(req.params.id);
    if (Number.isNaN(id)) return res.status(400).json('parâmetro incorreto.');

    const runner = AppDataSource.createQueryRunner();
    try {
      await runner.connect();

      const product = await new Product().findOne(runner, id);
      if (!product) {
        await runner.release();
        return res.status(400).json('produto não cadastrado.');
      }

      await runner.startTransaction();
      const response = await product.delete(runner);
      if (response.length > 0) {
        await runner.rollbackTransaction();
        await runner.release();
        return res.status(400).json(response);
      }
      await runner.commitTransaction();
      await runner.release();

      return res.json(response);
    } catch (e) {
      console.error(e);
      return res.status(400).json((e as TypeORMError).message);
    }
  }
}
