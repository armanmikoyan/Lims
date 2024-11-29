import { Test, TestingModule } from '@nestjs/testing';
import { ReagentService } from './reagent.service';
import { REAGENT_REPOSITORY_TOKEN } from './reagent.repository';
import { REQUEST_REPOSITORY_TOKEN } from '../reagentRequest/reagentRequest.repository';
import {
  deletedReagent,
  mockReagent,
  mockReagentRequest,
  reagentData,
  reagentList,
  updatedReagent,
  updateDto,
  updateDtoWithZero,
} from './mocks/reagentMocks';

describe('Reagent Service', () => {
  let reagentService: ReagentService;

  const mockReagentRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    updateById: jest.fn(),
    delete: jest.fn(),
  };

  const mockRequestRepository = {
    findById: jest.fn(),
    updateById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReagentService,
        { provide: REAGENT_REPOSITORY_TOKEN, useValue: mockReagentRepository },
        { provide: REQUEST_REPOSITORY_TOKEN, useValue: mockRequestRepository },
      ],
    }).compile();
    reagentService = module.get<ReagentService>(ReagentService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('CREATE Reagent Method', () => {
    it('should create reagent with correct data', async () => {
      mockReagentRepository.create.mockResolvedValue(reagentList.reagents[0]);

      const result = await reagentService.create(reagentData);
      expect(mockReagentRepository.create).toHaveBeenCalledWith(reagentData);
      expect(result).toEqual(reagentList.reagents[0]);
    });
  });

  describe('GET Reagents Method', () => {
    it('should return list of reagents without options', async () => {
      const options = { filter: {}, pagination: { skip: 0, take: 10 }, sort: {}, flag: {} };
      mockReagentRepository.findAll.mockResolvedValue(reagentList);
      const result = await reagentService.getReagents(options);

      expect(mockReagentRepository.findAll).toHaveBeenCalledWith(options.filter, options.pagination, options.sort, options.flag);
      expect(result).toEqual(reagentList);
    });
  });

  describe('GET Reagent by ID Method', () => {
    it('should return correct reagent by ID', async () => {
      mockReagentRepository.findById.mockResolvedValue(reagentList.reagents[0]);

      const result = await reagentService.getReagentById(1);
      expect(mockReagentRepository.findById).toHaveBeenCalledWith(1);
      expect(result).toEqual(reagentList.reagents[0]);
    });

    it('should return null when reagent not found by ID', async () => {
      mockReagentRepository.findById.mockResolvedValue(null);

      const result = await reagentService.getReagentById(4);

      expect(mockReagentRepository.findById).toHaveBeenCalledWith(4);
      expect(result).toBeNull();
    });
  });

  describe('EDIT Reagent by ID Method', () => {
    it('should update a reagent and return the updated reagent', async () => {
      mockReagentRepository.updateById.mockResolvedValue(updatedReagent);
      const result = await reagentService.editReagent(updateDto, 5);

      expect(mockReagentRepository.updateById).toHaveBeenCalledWith(updateDto, 5, false);
      expect(result).toEqual(updatedReagent);
    });

    it('should be marked as deleted if quantityLeft is 0', async () => {
      mockReagentRepository.updateById.mockResolvedValue(updatedReagent);
      const result = await reagentService.editReagent(updateDtoWithZero, 5);

      expect(mockReagentRepository.updateById).toHaveBeenCalledWith(updateDtoWithZero, 5, true);
      expect(result).toEqual(updatedReagent);
    });
  });

  describe('DELETE Reagent By ID', () => {
    it('should delete reagent by id', async () => {
      mockReagentRepository.delete.mockResolvedValue(deletedReagent);
      const result = await reagentService.deleteReagentById(5);

      expect(mockReagentRepository.delete).toHaveBeenCalledWith(5);
      expect(result).toEqual(deletedReagent);
    });
  });

  describe('CREATE Reagent From Reagent Request', () => {
    it('should create a reagent from a fulfilled reagent request', async () => {
      mockRequestRepository.findById.mockResolvedValue(mockReagentRequest);
      mockRequestRepository.updateById.mockResolvedValue({});
      mockReagentRepository.create.mockResolvedValue(mockReagent);

      const result = await reagentService.createReagentFromReagentRequest(1, 1);
      expect(mockRequestRepository.findById).toHaveBeenCalledWith(1);
      expect(mockReagentRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'H2O',
          storageId: 1,
        }),
      );
      expect(result).toEqual(mockReagent);
    });
  });
});
