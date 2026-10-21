// Fill a box with one cloned <template> row per item, bound through Kit's own name binding.
;(function(){
var ROW = window.ROW = {};

// box: the list element. tpl: its <template>. list: data items. each(el, item): optional extra wiring.
ROW.fill = function(box, tpl, list, each){
  box.replaceChildren();
  (list || []).forEach(function(item, i, el){
    el = tpl.content.firstElementChild.cloneNode(true);
    kit.bind(el, item);
    each && each(el, item, i);
    box.appendChild(el);
  });
  return box;
};
}());
