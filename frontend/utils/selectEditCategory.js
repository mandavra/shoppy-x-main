export default function selectEditCategory(allCategories,product){
    //check if the category exists, if doesn't then select the first category
    return allCategories.find(category=>category.value===product.category)?product.category:
    allCategories.length>0?allCategories[0].value:""
}