import React, { useEffect } from 'react';
import { useData } from '../state/DataContext';
import { Link } from 'react-router-dom';
import { FixedSizeList as List } from 'react-window';

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

  const Row = ({ id, name }) => (
    <li>
      <Link to={'/items/' + id}>{name}</Link>
    </li>
  );

  if (!items.length) return <p>Loading...</p>;

  return (
    <ul>
      <List
        height={150}
        itemCount={items.length}
        itemSize={35}
        width={300}
      >
        {items.map(item => (
          <Row key={item.id} id={item.id} name={item.name} />
        ))}
      </List>
    </ul>
  );
}

export default Items;