import gql from "graphql-tag";

/* 
AllTax: [tax]
OneTax: tax
NEW_PRECIO_ENVIO(data: SlideInput): Slide
UPD_PRECIO_ENVIO(id: ID): Response
*/

export const ALL_TAX = gql`
  query AllTax {
    AllTax {
      _id
      tax
      defaultTax
      cities {
        _id
        name
        departamento
      }
    }
  }
`;

export const ONE_TAX = gql`
  query OneTax($citiesName: CityInput) {
    OneTax(citiesName: $citiesName) 
  }
`;

export const NEW_PRECIO_ENVIO = gql`
  mutation NewTax($data: TaxInput) {
    NewTax(data: $data) {
      tax
      cities {
        name
        departamento
      }
    }
  }
`;

export const UPD_PRECIO_ENVIO = gql`
  mutation UpdTax($id: ID!,$data: TaxInput) {
    UpdTax(id: $id,data: $data) {
      _id
      tax
      cities {
        name
        departamento
      }
    }
  }
`;

export const DEL_CITIES_TAX = gql`
  mutation DelCitiesTax($id: ID,$idCities: ID) {
    DelCitiesTax(id: $id,idCities: $idCities) {
      _id
      tax
      cities {
        name
        departamento
      }
    }
  }
`;

export const DEL_TAX = gql`
  mutation DelTax($id: ID) {
    DelTax(id: $id) 
  }
`;