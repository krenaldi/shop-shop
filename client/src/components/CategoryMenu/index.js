import React, { useEffect } from "react";
import { UPDATE_CATEGORIES, UPDATE_CURRENT_CATEGORY } from '../../utils/actions'
import { useStoreContext } from '../../utils/GlobalState';
import { useQuery } from '@apollo/react-hooks';
import { QUERY_CATEGORIES } from "../../utils/queries";

function CategoryMenu() {
  const [ state, dispatch ] = useStoreContext();
  const { categories } = state;
  const { data: categoryData } = useQuery(QUERY_CATEGORIES);
  // const categories = categoryData?.categories || [];

  useEffect(() => {
    // if categoryData exists or has changed from response of useQuery then tun dispatch()
    if (categoryData) {
      // execute dispatch func w/ action obj indicating type of action & data to set state for categories
      dispatch({
        type: UPDATE_CATEGORIES,
        categories: categoryData.categories
      });
    }
  }, [categoryData, dispatch]);

  const handleClick = id => {
    dispatch({
      type: UPDATE_CURRENT_CATEGORY,
      currentCategory: id
    })
  }

  return (
    <div>
      <h2>Choose a Category:</h2>
      {categories.map(item => (
        <button
          key={item._id}
          onClick={() => {
            handleClick(item._id);
          }}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
}

export default CategoryMenu;
