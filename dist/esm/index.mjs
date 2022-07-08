function containsNative(node, targetTag) {
    if (node._nativeTag === targetTag) {
        return true;
    }
    for(let i = 0; i < node._children.length; i++){
        if (containsNative(node._children[i], targetTag)) {
            return true;
        }
    }
    return false;
}
function containsDOM(node, target) {
    if (node == target) {
        return true;
    }
    for(let i = 0; i < node.children.length; i++){
        if (containsDOM(node.children[i], target)) {
            return true;
        }
    }
    return false;
}
export default function contains(element, target) {
    // dom built-in
    if (element.contains) {
        return element.contains(target);
    } else if (element.children) {
        return containsDOM(element, target);
    }
    // native
    return containsNative(element, target._nativeTag ?? target);
};
