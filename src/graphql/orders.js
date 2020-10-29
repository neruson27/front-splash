import gql from "graphql-tag";

/* 
AllOrders: [Orders]
OneOrder(id: ID): Orders
CreateOrder(data: OrdersInput): Orders
UpdateOrdersStatus(id: ID, status: String): Orders
DeleteOrder(id: ID): Response 
*/

export const ALL_ORDER_QUERY = gql`
  query AllOrders($pagination: PaginationInput, $filter: FilterInput) {
    AllOrders(pagination: $pagination, filter: $filter) {
      orders {
        _id
        ref_payco
        orderNumber
        products {
          _id
          name
          description
          price
          highlight
          image
          branch {
            name
          }
          model
          category {
            name
          }
          subcategory {
            name
          }
          tags {
            name
          }
          ref
          quantity
          createdAt
        }
        price
        status
        createdAt
      }
      pagination {
        total
        page
        pages
        limit      
      }
    }
  }
`;

export const ONE_ORDER_QUERY = gql`
  query OneOrder($id: ID, $id_buyer: String) {
    OneOrder(id: $id, id_buyer:$id_buyer) {
      _id
      ref_payco
      orderNumber
      products {
        _id
        name
        description
        price
        image
        branch {
          name
        }
        model
        category {
          name
        }
        subcategory {
          name
        }
        tags {
          name
        }
        ref
        createdAt
      }
      checkout {
        name
        dni
        total
        concept
        tlf
        city
        dir
        email
      }
      price
      status
      createdAt
    }
  }
`;

export const NUM_ORDER = gql`
  query NumOrders {
    NumOrders
  }
`

export const CREATE_ORDER = gql`
  mutation CreateOrder($data: OrdersInput!) {
    CreateOrder(data: $data) {
      _id
      ref_payco
      orderNumber
      products {
        _id
        name
        description
        price
        image
        branch {
          name
        }
        model
        category {
          name
        }
        subcategory {
          name
        }
        tags {
          name
        }
        ref
        createdAt
      }
      price
      status
      createdAt
    }
  }
`;

export const ORDER_STATUS_UPDATE = gql`
  mutation UpdateOrdersStatus($id: ID!, $status: String, $ref: String) {
    UpdateOrdersStatus(id: $id, status: $status, ref: $ref) {
      _id
      ref_payco
      orderNumber
      products {
        _id
        name
        description
        price
        image
        branch {
          name
        }
        model
        category {
          name
        }
        subcategory {
          name
        }
        tags {
          name
        }
        ref
        createdAt
      }
      price
      status
      createdAt
    }
  }
`;

export const ORDER_DELETE = gql`
  mutation DeleteOrder($branchId: ID!) {
    DeleteOrder(id: $branchId) {
      status
    }
  }
`;