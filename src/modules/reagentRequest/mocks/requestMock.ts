import { Package, Status } from '@prisma/client';
import { Order, ReagentRequestOptions } from '../interfaces/reagentRequestOptions.interface';

export const createRequestBody = {
  name: 'Reagent Request for Unit Test',
  userId: 1,
  desiredQuantity: 300,
  quantityUnit: 'ml',
  userComments: 'request for unit test',
  package: Package.Bottle,
};

export const createRequestResponseBody = {
  id: 1,
  name: 'Reagent Request for Unit Test',
  userId: 1,
  desiredQuantity: 300,
  quantityUnit: 'ml',
  userComments: 'request for unit test',
  package: Package.Bottle,
  status: Status.Pending,
};

export const updateRequestBody = {
  procurementComments: 'ordered the H2O',
  status: Status.Ordered,
  desiredQuantity: 1500,
};

export const updateRequestResponseBody = {
  id: 1,
  name: 'H2O',
  userId: 1,
  desiredQuantity: 1500,
  quantityUnit: 'ml',
  userComments: 'Request for distilled water',
  package: Package.Bottle,
  status: Status.Ordered,
  procurementComments: 'ordered the H2O',
};

export const requestList = [
  {
    id: 1,
    name: 'H2O',
    userId: 1,
    desiredQuantity: 1000,
    quantityUnit: 'ml',
    userComments: 'Request for distilled water',
    package: Package.Bottle,
    status: Status.Pending,
  },
  {
    id: 2,
    name: 'NaCl',
    userId: 2,
    desiredQuantity: 500,
    quantityUnit: 'g',
    userComments: 'Request for laboratory-grade salt',
    package: Package.SolventsBox,
    status: Status.Ordered,
    orderId: 1,
    procurementComments: 'ordered the request',
  },
  {
    id: 3,
    name: 'HCl',
    userId: 3,
    desiredQuantity: 250,
    quantityUnit: 'ml',
    userComments: 'Request for 37% hydrochloric acid',
    package: Package.Bottle,
    status: Status.Declined,
    procurementComments: 'declined the request',
  },
  {
    id: 4,
    name: 'C2H5OH',
    userId: 3,
    desiredQuantity: 500,
    quantityUnit: 'ml',
    userComments: 'Request for ethanol (lab use)',
    package: Package.Bottle,
    status: Status.Fulfilled,
  },
  {
    id: 5,
    name: 'NH3',
    userId: 2,
    desiredQuantity: 100,
    quantityUnit: 'ml',
    userComments: 'Request for concentrated ammonia',
    package: Package.Bottle,
    status: Status.Submitted,
    procurementComments: 'submitted the request',
  },
  {
    name: 'Reagent Request for Unit Test',
    userId: 1,
    desiredQuantity: 300,
    quantityUnit: 'ml',
    userComments: 'request for unit test',
    package: Package.Bottle,
    status: Status.Pending,
  },
  {
    name: 'Request 1',
    userId: 3,
    desiredQuantity: 400,
    quantityUnit: 'ml',
    userComments: 'request for unit test',
    package: Package.Bottle,
    procurementComments: 'submitted the request',
    status: Status.Submitted,
  },
  {
    name: 'C20',
    userId: 2,
    desiredQuantity: 600,
    quantityUnit: 'g',
    userComments: 'request for unit test',
    package: Package.PackageBox,
    procurementComments: 'ordered the request',
    status: Status.Ordered,
    orderId: 2,
  },
  {
    name: 'N20',
    userId: 4,
    desiredQuantity: 500,
    quantityUnit: 'kg',
    userComments: 'request for unit test',
    package: Package.SolventsBox,
    procurementComments: 'declined the request',
    status: Status.Declined,
  },
];

export const options: ReagentRequestOptions = {
  filter: { status: Status.Ordered },
  pagination: { skip: 0, take: 10 },
  sort: { sortByQuantity: Order.ASC },
};
