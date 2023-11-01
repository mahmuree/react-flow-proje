import Dagre from '@dagrejs/dagre';  // dagre: grafik düzenlemeye yarayan kütüphane
import React, { useCallback } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  Panel,
  useNodesState, //düğümleri yönetmek için kullanılır. React Flow içindeki düğüm verilerini saklamak ve güncellemek için gereklidir
  useEdgesState, //kenarları yönetmek için kullanılır. React Flow içindeki kenar verilerini saklamak ve güncellemek için gereklidir
  useReactFlow,
  Background,
} from 'reactflow';

import { initialNodes, initialEdges } from './nodesEdges.js';
import 'reactflow/dist/style.css';

const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
//.setDefaultEdgeLabel() Yöntemi: Bu yöntem, Graph nesnesi tarafından sağlanır ve kenarların varsayılan 
//etiketlerini tanımlamak için kullanılır. Kenar etiketleri, her bir kenarın üzerine ek bilgi eklemek veya özel 
//özellikler saklamak için kullanılabilir.
//() => ({}) İfadesi: Bu, bir fonksiyonu ifade eder. Burada kullanılan fonksiyon, her bir kenar için bir etiket üretir. 
//() => ({}) ifadesi, her kenar için boş bir etiket nesnesi oluşturur. Bu nesne, kenarların özel bilgi veya özellikleri 
//saklayabileceği bir yapıdır. Bu ifade, her kenarın varsayılan etiketini boş bir nesne olarak ayarlar.

const getLayoutedElements = (nodes, edges, options) => //düzenlenmiş elemanları (nodes ve edges) döndüren bir işlevdir. 
//İşlev, nodes (düğümler), edges (kenarlar) ve options (seçenekler) 
//adlı üç giriş parametresini kabul eder. options parametresi, düzenleme işlemi için ek seçenekleri içerir.
{ 
  g.setGraph({ rankdir: options.direction }); //setGraph işlemi, grafik yapısının genel özelliklerini tanımlar.
  //rankdir: options.direction } ifadesi, grafik yapısının düzenleme yönünü belirler
  //options.direction: Bu, options nesnesinin içindeki direction özelliğini temsil eder. Bu özellik, grafik yapısının düzenini sıralamanın yönünü belirler. 
  //Özellikle rankdir seçeneği, düğümlerin veya kenarların nasıl sıralandığını kontrol etmek için kullanılır. 
  //Değerler genellikle "TB" (yukarıdan aşağıya), "BT" (aşağıdan yukarıya), "LR" (soldan sağa) veya "RL" (sağdan sola) gibi grafik düzenleme yönlerini temsil eder.

  edges.forEach((edge) => g.setEdge(edge.source, edge.target)); //döngü ile kenarlar ve düğümler eklenir
  nodes.forEach((node) => g.setNode(node.id, node));

  Dagre.layout(g);  
  //Dagre.layout(g): Bu işlem, verilen g grafiğinin düzenini hesaplar ve günceller.
  // Grafik düzeni, düğümlerin ve kenarların birbirlerine göre nasıl yerleştirildiğini, sıralandığını ve bağlandığını belirler.

  return {
    nodes: nodes.map((node) => {
      const { x, y } = g.node(node.id); //her düğümün (node) x ve y koordinatlarını g adlı grafik yapısından alır.
      // g.node(node.id) ifadesi, g grafik yapısındaki belirli bir düğümün pozisyonunu alıyor. 
      //Düğümün kimliği (node.id), pozisyon bilgisini almak için kullanılır.
      //const { x, y } = ... : Bu değişken çözme (destructuring) işlemidir ve
      // x ve y adlı değişkenlere g.node(node.id) ifadesinin sonucundaki pozisyon bilgilerini atar.

      return { ...node, position: { x, y } }; //Bu ifade, her düğümün mevcut bilgisini kopyalar ve yeni bir position özelliği ekler. 
      //Yani, her düğümün orijinal bilgisi korunurken, bir position özelliği de eklenir. 
      //Bu position özelliği, x ve y adlı koordinatları içeren bir nesnedir. Bu, her düğümün pozisyon bilgilerini temsil eder.
    }),
    edges, //edges: edges dizisi, herhangi bir değişiklik yapılmadan olduğu gibi korunur 
    //ve dönüş değerindeki nesnenin edges özelliği olarak eklenir.
  };
};

const LayoutFlow = () => {  //LayoutFlow: bir akış diyagramı veya benzeri bir grafik yapısının düzenini yönetmek için kullanılan bir bileşen
  const { fitView } = useReactFlow(); //Genellikle fitView işlemi, grafik yapısı büyütüldüğünde veya küçültüldüğünde, 
  //kullanıcının tam görünümü görmesini sağlamak amacıyla kullanılır. Ölçeklendirmek konumlandırmak içimn kullanulır
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes); 
  // Bu satırda, useNodesState özelliği kullanılır. Bu özellik, düğümleri temsil eden bir dizi (nodes), 
  //bu düğümleri güncellemek için bir işlev (setNodes) ve düğümlerde değişiklikler olduğunda çağrılacak bir başka işlev (onNodesChange)
  // döndürür. Bu özellik, olası akış diyagramı düğümlerini ve onların durumlarını yönetmek için kullanılır. 
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onLayout = useCallback(
    (direction) => {
      const layouted = getLayoutedElements(nodes, edges, { direction });
      //const layouted = getLayoutedElements(nodes, edges, { direction });: Bu satırda, getLayoutedElements işlevi çağrılır ve 
      //nodes, edges, ve direction parametreleri ile çağrılır. Bu işlev, nodes ve edges dizilerini kullanarak belirli bir 
      //yönde (direction) düzenlenmiş elemanları hesaplar ve layouted adlı bir nesneye atar.

      setNodes([...layouted.nodes]);
      setEdges([...layouted.edges]);
      // Bu satırlarda, layouted nesnesinden alınan düzenlenmiş nodes ve edges bilgileri, ilgili setNodes ve setEdges işlevleri ile 
      //bileşenin durumunu güncellemek için kullanılır. Bu, grafik yapısındaki düğümler ve kenarların yeni düzenini uygular.

      window.requestAnimationFrame(() => {
        fitView();
      });
    }, //requestAnimationFrame, tarayıcının yeniden çizim döngüsüne bir işlev eklemek için kullanılır. 
    // işlev, fitView işlemini çağırır. fitView, grafik yapısının görünümünü düzenler ve tüm içeriği ekranda görünür hale getirir.
    // Bu işlem, grafik yapısının düzenlendiğinde görünümün güncellenmesini sağlar.
    [nodes, edges]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      fitView
    >
    <div style={{ width:'500px', height:'600px'}}>
    <Panel position="top-right">
        <button onClick={() => onLayout('TB')}>vertical layout</button> 
        <button onClick={() => onLayout('LR')}>horizontal layout</button>
      </Panel>
    </div>

    </ReactFlow>
  );
};

export default function () {
  return (
    <ReactFlowProvider>
      <LayoutFlow />
    </ReactFlowProvider>
  );
}

