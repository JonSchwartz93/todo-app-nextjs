"use client";
import { useState, useEffect } from "react";
import { FaRegTrashCan } from "react-icons/fa6";
import { MdOutlineEdit } from "react-icons/md";

interface ingredient {
  id: number;
  name: string;
  completed: boolean;
}

export default function Home() {
  const [ingredients, setIngredients] = useState<ingredient[]>([]);
  const [ingredientName, setIngredientName] = useState<string>("");
  const [userError, setUserError] = useState("");

  const [aiResponse, setAIResponse] = useState<string>("");
  const [fetching, setIsFetching] = useState<boolean>(false);
  // const [apiError, setApiError] = useState<string>("");

  useEffect(() => {
    const ingredients = localStorage.getItem("ingredients");
    if (ingredients) {
      setIngredients(JSON.parse(ingredients));
    }
  }, []);

  const addIngredient = () => {
    if (!ingredientName.length) {
      return setUserError("Please add a ingredient");
    };

    const newIngredient = {
      id: Math.random(),
      name: ingredientName,
      completed: false
    };
    
    setIngredients([...ingredients, newIngredient]);
    localStorage.setItem("ingredients", JSON.stringify([...ingredients, newIngredient]));
    setUserError("")
    setIngredientName("");
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        addIngredient();
      }
    };
  
    window.addEventListener('keydown', handleKeyPress);
  
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [ingredientName, ingredients]);

  const deleteIngredient = (id: number) => {
    const updatedIngredients = ingredients.filter(ingredient => ingredient.id !== id);
    setIngredients([...updatedIngredients]);
    localStorage.setItem("ingredients", JSON.stringify(updatedIngredients));
  };

  const updateIngredientStatus = (id: number) => {
    const updatedIngredients = ingredients.map(ingredient => {
      if (ingredient.id === id) {
        return {
          ...ingredient,
          completed: !ingredient.completed
        }
      }
      return ingredient;
    })
    setIngredients([...updatedIngredients]);
    localStorage.setItem("ingredients", JSON.stringify(updatedIngredients));
  }
 
  const handleGenerateAiRecipe = async () => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ingredients: ingredients.map(ingredient => ingredient.name).join(", "),
      }),
    }

    try {
      setIsFetching(true)
      const response = await fetch('http://localhost:3000/api/openai', options);
      const data =  await response.json();
      setAIResponse(data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetching(false)
    }
  }

  return (
    <div className="flex mt-4 mx-4">
      <div className="w-1/3 text-2xl mr-4">
        <div className="flex justify-between mb-4">
          <div className="flex flex-col">
            <input
              className={`mr-4 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${ingredientName.length ? 'normal' : 'italic'}`}
              type="text"
              placeholder="Add Ingredients"
              value={ingredientName}
              onChange={((e) => setIngredientName(e.target.value))}
            />
            {<p className="text-red-500 text-sm italic">{userError}</p>}
          </div>
          <button
            onClick={addIngredient}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Add
          </button>
        </div>
        <div className="flex flex-col">
          {ingredients.map((ingredient) => (
            <div className="flex items-center" key={ingredient.id}>
              <input
                type="checkbox"
                onChange={() => {updateIngredientStatus(ingredient.id)}}
                checked={ingredient.completed}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 mr-2"
              />
              <p className={`capitalize mr-2 ${ingredient.completed && 'text-decoration-line: line-through'}`}>
                {ingredient.name}
              </p>
              <button className="mr-2" onClick={() => deleteIngredient(ingredient.id)}>
                <FaRegTrashCan size={20} />
              </button>
              {/* <button className="mr-2" onClick={() => deleteIngredient(ingredient.id)}>
                <MdOutlineEdit size={20} />
              </button> */}
            </div>
          ))}
        </div>
        <div>
          <button
            className={ingredients.length < 5 ? "bg-gray-300 px-4 py-2 rounded-md cursor-not-allowed opacity-50" : "bg-orange-400 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"}
            disabled={ingredients.length < 5}
            onClick={() => handleGenerateAiRecipe()}
          >
            {fetching ? 'Loading your recipe...' : 'What can I cook?'}
            {ingredients.length < 5 && <p className="text-red-500 text-sm italic">Add at least 5 ingredients before requesting a recipe</p>}
          </button>
        </div>
      </div>
      <div className="w-2/3 text-2xl">
          {aiResponse && <p>{aiResponse}</p>}
          {/* {apiError && <p>Something went wrong. Please try again.</p>} */}
      </div>
    </div>
  );
}
