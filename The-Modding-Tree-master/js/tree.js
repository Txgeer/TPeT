var layoutInfo = {
    startTab: "none",
    startNavTab: "tree-tab",
	showTree: true,

    treeLayout: ""

    
}


// A "ghost" layer which offsets other layers in the tree 
addNode("blank", {
    layerShown: "ghost",
}, 
)


addLayer("tree-tab", {
    tabFormat: [["tree", function() {return (layoutInfo.treeLayout ? layoutInfo.treeLayout : TREE_LAYERS)}]],
    previousTab: "",
    leftTab: true,
})

/*
B:你好
L:我很好
B:我也很好
L:正题呢?
B:layer.js在哪里?
L:我应该放了啊
B:我只看到一个tree.js
B:你可以把整个文件夹放进来的
L:你人呢
B:换了，我等你找到我
---> [  ] <---待机处
L:<h1>乐</h1>

L:6

*/