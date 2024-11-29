import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { ReagentRepository } from './reagent.repository';
import { Category } from '@prisma/client';
import { FlagOptions, Order, PaginationOptions, SortOptions } from './interfaces/reagentOptions.interface';
import { data, filter } from './mocks/reagentMocks';
import { sortAsc, sortDesc } from './utils/reagentUtils';

describe('Reagent Repository Integration Test', () => {
  let reagentRepository: ReagentRepository;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReagentRepository, PrismaService],
    }).compile();

    reagentRepository = module.get<ReagentRepository>(ReagentRepository);
    prisma = module.get<PrismaService>(PrismaService);
  });

  beforeAll(async () => {
    await prisma.reagent.createMany({
      data: data,
    });
  });

  afterAll(async () => {
    await prisma.reagent.deleteMany({
      where: {
        name: {
          in: [
            'Reagent Integration Test 1',
            'Reagent Integration Test 2',
            'Reagent Integration Test 3',
            'Sample Integration Test 1',
            'Sample Integration Test 2',
          ],
        },
      },
    });
  });

  describe('findAll(options?)Method', () => {
    it('should return all reagents, if options were not provided', async () => {
      const result = await reagentRepository.findAll();
      expect(result.size).toBeDefined();
      expect(Number(result.size)).toBeGreaterThan(0);
      expect(result.reagents).toBeDefined();
      expect(result.reagents.length).toBeGreaterThan(0);
    });

    it('should return reagents that match-> filter: name, structure, category, storageId', async () => {
      const result = await reagentRepository.findAll(filter);
      expect(result).toBeDefined();
      expect(result.reagents).toBeDefined();
      expect(result.reagents.length).toBeGreaterThan(0);

      result.reagents.forEach((reagent) => {
        expect(reagent.category).toBe(Category.Reagent);
        expect(reagent.structure).toContain(filter.structure);
        expect(reagent.name.toLowerCase()).toContain(filter.name.toLowerCase());
        expect(reagent.storageId).toEqual(filter.storageId);
      });
    });
  });

  it('should return reagents that match-> filter: name, structure, category, storageId, flag: isFullStructure: true, pagination', async () => {
    const flag: FlagOptions = { isFullStructure: true };
    const pagination: PaginationOptions = { skip: 0, take: 10 };
    const result = await reagentRepository.findAll(filter, pagination, {}, flag);
    expect(result).toBeDefined();
    expect(result.reagents).toBeDefined();
    expect(result.reagents.length).toBeGreaterThan(0);

    result.reagents.forEach((reagent) => {
      expect(reagent.category).toBe(Category.Reagent);
      expect(reagent.structure).toBe(filter.structure);
      expect(reagent.name.toLowerCase()).toContain(filter.name.toLowerCase());
      expect(reagent.storageId).toEqual(filter.storageId);
    });
  });

  it('should return reagents that match-> filter: name, structure, category, storageId, flag: isFullStructure: false, pagination', async () => {
    const flag: FlagOptions = { isFullStructure: false };
    const pagination: PaginationOptions = { skip: 0, take: 10 };
    const result = await reagentRepository.findAll(filter, pagination, {}, flag);
    expect(result).toBeDefined();
    expect(result.reagents).toBeDefined();
    expect(result.reagents.length).toBeGreaterThan(0);
    result.reagents.forEach((reagent) => {
      expect(reagent.category).toBe(Category.Reagent);
      expect(reagent.structure).not.toBe(filter.structure);
      expect(reagent.name.toLowerCase()).toContain(filter.name.toLowerCase());
      expect(reagent.storageId).toEqual(filter.storageId);
    });
  });

  it('should return reagents that match-> pagination, sort: name:asc', async () => {
    const pagination: PaginationOptions = { skip: 0, take: 10 };
    const sorting: SortOptions = {
      sortByName: Order.ASC,
    };
    const result = await reagentRepository.findAll({}, pagination, sorting);
    expect(result).toBeDefined();
    expect(result.reagents).toBeDefined();
    expect(result.reagents.length).toBeGreaterThan(0);
    const reagentNames = result.reagents.map((reagent) => reagent.name);
    const sorted = sortAsc(result);
    expect(reagentNames).toEqual(sorted);
  });

  it('should return reagents that match-> pagination, sort: name:desc', async () => {
    const pagination: PaginationOptions = { skip: 0, take: 10 };
    const sorting: SortOptions = {
      sortByName: Order.DESC,
    };
    const result = await reagentRepository.findAll({}, pagination, sorting);
    expect(result).toBeDefined();
    expect(result.reagents).toBeDefined();
    expect(result.reagents.length).toBeGreaterThan(0);
    const reagentNames = result.reagents.map((reagent) => reagent.name);
    const sorted = sortDesc(result);
    expect(reagentNames).toEqual(sorted);
  });
});
