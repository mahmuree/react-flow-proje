export const initialNodes = [
    {
      id: 'a',
      type: 'input',
      data: { label: 'A Elementi' },
      position: { x: 0, y: 0 },
    },
    {
      id: 'b',
      data: { label: 'B Elementi' },
      position: { x: 0, y: 100 },
    },
    {
      id: 'c',
      data: { label: 'C Elementi' },
      position: { x: 0, y: 200 },
    },
    {
      id: 'd',
      data: { label: 'D  Elementi' },
      position: { x: 0, y: 300 },
    },
    {
      id: 'e',
      data: { label: 'E Elementi' },
      position: { x: 0, y: 400 },
    },
    
  ];
  
  export const initialEdges = [
    { id: 'ab', source: 'a', target: 'b', animated: true },
    { id: 'bc', source: 'b', target: 'c', animated: true },
    { id: 'bd', source: 'b', target: 'd', animated: true },
    { id: 'de', source: 'd', target: 'e', animated: true },
    { id: 'ce', source: 'c', target: 'e', animated: true },
    
  ];
  
