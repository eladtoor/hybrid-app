// src/utils/adminPanelUtils.js

export const generateCombinations = (arrays) => {
  if (arrays.length === 0) return [[]];
  const firstArray = arrays[0];
  const restArrays = generateCombinations(arrays.slice(1));
  const combinations = [];
  firstArray.forEach((value) => {
    restArrays.forEach((rest) => {
      combinations.push([value, ...rest]);
    });
  });
  return combinations;
};

export const fetchCategories = (categories) => {
  if (categories?.categories?.companyCategories) {
    return Object.values(categories.categories.companyCategories).map(
      (category) => ({
        categoryName: category.categoryName,
        subCategories: category.subCategories.map((subCategory) => ({
          subCategoryName: subCategory.subCategoryName,
        })),
      })
    );
  }
  return [];
};

export const handleSearch = (query, products) => {
  if (query) {
    const lowerCaseQuery = query.toLowerCase();

    return products.filter((product) => {
      const id = product.מזהה ? String(product.מזהה).toLowerCase() : "";
      const sku = product['מק"ט'] ? String(product['מק"ט']).toLowerCase() : "";
      const name = product.שם ? String(product.שם).toLowerCase() : "";

      return (
        id.includes(lowerCaseQuery) ||
        sku.includes(lowerCaseQuery) ||
        name.includes(lowerCaseQuery)
      );
    });
  } else {
    return products; // Reset to all products if query is empty
  }
};

// New utility functions for form and attribute management

export const handleMainCategoryChange = (
  categoryName,
  setSelectedMainCategories,
  selectedSubCategories,
  setSelectedSubCategories
) => {
  setSelectedMainCategories((prevSelected) => {
    const alreadySelected = prevSelected.includes(categoryName);
    if (alreadySelected) {
      const updated = prevSelected.filter((name) => name !== categoryName);
      const { [categoryName]: _, ...rest } = selectedSubCategories;
      setSelectedSubCategories(rest);
      return updated;
    } else {
      return [...prevSelected, categoryName];
    }
  });
};

export const handleSubCategoryChange = (
  mainCategoryName,
  subCategoryName,
  selectedSubCategories,
  setSelectedSubCategories
) => {
  setSelectedSubCategories((prevSelected) => {
    const subCategoriesForMain = prevSelected[mainCategoryName] || [];
    const alreadySelected = subCategoriesForMain.includes(subCategoryName);
    const updatedSubCategories = alreadySelected
      ? subCategoriesForMain.filter((name) => name !== subCategoryName)
      : [...subCategoriesForMain, subCategoryName];

    return {
      ...prevSelected,
      [mainCategoryName]: updatedSubCategories,
    };
  });
};

export const handleInputChange = (e, setNewProduct) => {
  const { name, value } = e.target;
  setNewProduct((prevProduct) => ({
    ...prevProduct,
    [name]: value,
  }));
};

export const handleRadioChange = (e, setNewProduct) => {
  const newType = e.target.value;
  setNewProduct((prevProduct) => ({
    ...prevProduct,
    סוג: newType,
    attributes:
      newType === "variable"
        ? prevProduct.attributes || [
            { name: "", values: [{ value: "", price: 0 }] },
          ]
        : [], // הוספת ערך ברירת מחדל אם הסוג הוא variable
  }));
};

export const handleAttributeChange = (
  index,
  field,
  value,
  newProduct,
  setNewProduct
) => {
  const updatedAttributes = newProduct.attributes.map((attribute, i) =>
    i === index ? { ...attribute, [field]: value } : attribute
  );
  setNewProduct({ ...newProduct, attributes: updatedAttributes });
};

export const handleAttributeValueChange = (
  attrIndex,
  valueIndex,
  field,
  value,
  newProduct,
  setNewProduct
) => {
  const updatedAttributes = newProduct.attributes.map((attribute, i) =>
    i === attrIndex
      ? {
          ...attribute,
          values: attribute.values.map((valObj, j) =>
            j === valueIndex ? { ...valObj, [field]: value } : valObj
          ),
        }
      : attribute
  );
  setNewProduct({ ...newProduct, attributes: updatedAttributes });
};

export const handleAddAttribute = (newProduct, setNewProduct) => {
  setNewProduct((prevProduct) => ({
    ...prevProduct,
    attributes: [...prevProduct.attributes, { name: "", values: [""] }],
  }));
};

export const handleAddAttributeValue = (index, newProduct, setNewProduct) => {
  const updatedAttributes = newProduct.attributes.map((attribute, i) =>
    i === index
      ? { ...attribute, values: [...attribute.values, ""] }
      : attribute
  );
  setNewProduct({ ...newProduct, attributes: updatedAttributes });
};
