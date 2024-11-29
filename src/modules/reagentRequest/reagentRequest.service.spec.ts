import { Test, TestingModule } from '@nestjs/testing';
import { ReagentRequestService } from './reagentRequest.service';
import { REQUEST_REPOSITORY_TOKEN } from './reagentRequest.repository';
import {
  createRequestBody,
  createRequestResponseBody,
  options,
  requestList,
  updateRequestBody,
  updateRequestResponseBody,
} from './mocks/requestMock';
import { getRequestById, getRequestForUser } from './utils/requestUtils';

describe('Reagent Request Service Unit Test', () => {
  let service: ReagentRequestService;
  const mockRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
    findById: jest.fn(),
    updateById: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReagentRequestService,
        {
          provide: REQUEST_REPOSITORY_TOKEN,
          useValue: mockRepository,
        },
      ],
    }).compile();
    service = module.get<ReagentRequestService>(ReagentRequestService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create Reagent Request', async () => {
    mockRepository.create.mockReturnValue(createRequestResponseBody);
    const result = await service.create(createRequestBody);

    expect(mockRepository.create).toHaveBeenCalledWith(createRequestBody);
    expect(result).toBe(createRequestResponseBody);
  });

  it('should get the list of request for Procurement Officer', async () => {
    mockRepository.findAll.mockReturnValue(requestList);
    const result = await service.getReagentRequestsForProcurementOficcer(options);

    expect(mockRepository.findAll).toHaveBeenCalledWith(options.filter, options.pagination, options.sort);
    expect(result).toEqual(requestList);
  });

  it('should get the list of request for Researcher', async () => {
    const list = getRequestForUser(2, requestList);
    mockRepository.findAll.mockReturnValue(list);
    const result = await service.getReagentRequestsForResearchers(options, 2);

    expect(mockRepository.findAll).toHaveBeenCalledWith(options.filter, options.pagination, options.sort, 2);
    expect(result).toEqual(list);
  });

  it('should return Reagent Request by ID', async () => {
    const request = getRequestById(3, requestList);
    mockRepository.findById.mockReturnValue(request);
    const result = await service.getRequestById(3);

    expect(mockRepository.findById).toHaveBeenCalledWith(3);
    expect(result).toEqual(request);
  });

  it('should edit the Reagent Request', async () => {
    mockRepository.updateById.mockReturnValue(updateRequestResponseBody);
    const result = await service.editReagentRequest(updateRequestBody, 1);

    expect(mockRepository.updateById).toHaveBeenCalledWith(updateRequestBody, 1);
    expect(result).toEqual(updateRequestResponseBody);
  });
});
