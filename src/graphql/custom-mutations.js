export const deleteItems = /* GraphQL */ `
  mutation DeleteItems(
    $inputs: [DeleteItemInput]!
    $condition: ModelItemConditionInput
  ) {
    deleteItems(input: $inputs, condition: $condition) {
      id
      name
      description
      image
      price
      category
      createdAt
      updatedAt
    }
  }
`;