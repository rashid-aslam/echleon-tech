import React, { useEffect } from 'react';
import { useData } from '../state/DataContext';
import { Link } from 'react-router-dom';

function Items() {
  const { items, fetchItems } = useData();

  useEffect(() => {
    let active = true;
  
    // Intentional bug: setState called after component unmount if request is slow
    // FIXED the problem by creating an async function inside the useEffect so we have the fetch items
    // result before mounting.
    const loadItems = async () => {
      try {
        const result = await fetchItems();
      } catch (error) {
        if (active) {
          console.error('Failed to fetch items:', error);
        }
      }
    };
  
    loadItems();
  
    return () => {
      active = false;
    };
  }, [fetchItems]);

  if (!items.length) return <p>Loading...</p>;

  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          <Link to={'/items/' + item.id}>{item.name}</Link>
        </li>
      ))}
    </ul>
  );
}

export default Items;