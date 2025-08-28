## Backend
1. **Refactor blocking I/O**  
: ### ✅ Improvements:
- **Non-blocking I/O**: Uses `fs.promises.readFile` and `fs.promises.writeFile` to avoid blocking the event loop.
- **Async/await throughout**: Ensures consistent error handling and better scalability.
- **Cleaner separation**: `readData` and `writeData` utilities make the code more modular.
2. **Performance**
: ### ✅ Solution: Cache + File Watch
1. Cache the stats in memory.
2. Watch the file for changes and update the cache only when needed.
3. Serve cached stats instantly on every request.


## Frontend (React)
1. Memory Leak
    FIXED the problem by creating an async function inside the useEffect so we have the fetch items result before mounting.
3. Performance
    react-window library integration for smooth scrolling of huge records