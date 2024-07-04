function RecipeCard({recipe}) {
  return (
    <div className=" bg-white p-5 rounded-2xl space-y-3">
        <h3 className="text-xl font-bold">{recipe.title}</h3>
        <p>{recipe.description}</p>
        <div className="space-x-1">
         {/* {recipe.ingredients.length && recipe.ingredients.map((ingredient,i)=> (
          <span key={i} className="text-sm text-gray-500">
            {i === recipe.ingredients.length - 1 ? ingredient : `${ingredient},`}
          </span>
         ))} */}
         {/* <span className="text-orange-500 bg-slate-50 border border-slate-200 text-xs px-2 py-1 rounded-md">
           {recipe.category}
          </span> */}
        </div>
        <p className="font-medium">฿{recipe.price}</p>
        <button className="px-3 py-2 bg-orange-400 text-white rounded-md text-sm">Add to order list</button>
    </div>
  )
}

export default RecipeCard