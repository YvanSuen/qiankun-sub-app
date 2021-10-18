<!-- 树状选择器 -->
<template>
  <el-popover
    ref="popover"
    placement="bottom-start"
    trigger="click"
    @show="onShowPopover"
    @hide="onHidePopover">
    <el-tree
      ref="tree"
      node-key="id"
      class="select-tree"
      :highlight-current="true"
      :style="`min-width: ${treeWidth}`"
      :data="data"
      :props="props"
      :expand-on-click-node="false"
      :filter-node-method="filterNode"
      :default-expand-all="false"
      :default-expanded-keys="idArr"
      @node-click="onClickNode">
    </el-tree>
    <el-input
      slot="reference"
      ref="input"
      v-model="labelModel"
      clearable
      :style="`width: ${width}px`"
      :class="{ 'rotate': showStatus }"
      suffix-icon="el-icon-arrow-down"
      :placeholder="placeholder">
    </el-input>
  </el-popover>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    // 接收绑定参数
    value: String,
    // 输入框宽度
    width: String,
    // 输入框占位符
    placeholder: {
      type: String,
      required: false,
      default: '请选择',
    },
    // 树节点配置选项
    props: {
      type: Object,
      required: false,
      default: () => ({
        parent: 'parentId',
        value: 'rowGuid',
        label: 'areaName',
        children: 'children',
      })
    }
  },
  // 设置绑定参数
  model: {
    prop: 'value',
    event: 'selected',
  },
  computed: {
    // 若非树状结构，则转化为树状结构数据
    data() {
      return this.options
    },
  },
  watch: {
    labelModel(val) {
      if (!val) {
        this.valueModel = '';
      }
      this.$refs.tree.filter(val);
    },
    value(val) {
      this.labelModel = this.queryTree(this.data, val);
    },
  },
  data() {
    return {
      // 树状菜单显示状态
      showStatus: false,
      // 菜单宽度
      treeWidth: 'auto',
      // 输入框显示值
      labelModel: '',
      // 实际请求传值
      valueModel: '0',
      // 数据列表
      options: [],
      // 数据转为json
      json:[],
      idArr: []
    };
  },
  created() {
    // 检测输入框原有值并显示对应 label
    if (this.value) {
      this.labelModel = this.queryTree(this.data, this.value);
    }
    // 获取输入框宽度同步至树状菜单宽度
    this.$nextTick(() => {
      this.treeWidth = `${(this.width || this.$refs.input.$refs.input.clientWidth) - 24}px`;
    });

    this.toTree()

  },
  methods: {
    getNode(id,lable){
      this.$nextTick(() => {
        // treeBox 元素的ref   value 绑定的node-key
        this.$refs.tree.setCurrentKey(id); 
        this.valueModel = id
        this.labelModel = lable
      });
    },
    // 单击节点
    onClickNode(node) {
      this.labelModel = node[this.props.label];
      this.valueModel = node[this.props.value];
      this.onCloseTree();
    },
    // 隐藏树状菜单
    onCloseTree() {
      this.$refs.popover.showPopper = false;
    },
    // 显示时触发
    onShowPopover() {
      this.showStatus = true;
      this.$refs.tree.filter(false);
    },
    // 隐藏时触发
    onHidePopover() {
      this.showStatus = false;
      this.$emit('selected', this.valueModel);
    },
    // 树节点过滤方法
    filterNode(query, data) {
      if (!query) return true;
      return data[this.props.label].indexOf(query) !== -1;
    },
    // 搜索树状数据中的 ID
    queryTree(tree, id) {
      let stark = [];
      stark = stark.concat(tree);
      while (stark.length) {
        const temp = stark.shift();
        if (temp[this.props.children]) {
          stark = stark.concat(temp[this.props.children]);
        }
        if (temp[this.props.value] === id) {
          return temp[this.props.label];
        }
      }
      return '';
    },
    async getdateDept(){
      let params = new URLSearchParams();
      params.append("strWhere","1=1")
      await axios.post(BaseWebApiUrl+"/SysDept/QuerySysDeptTreeListVUE",  params).then((res) => {
        if(res.data.returnCode=="1"){
            //console.log(res.data.returnData)
            this.json =  JSON.parse(res.data.returnData);
            this.json.forEach((m) => {
                if (m.open == 'true') {
                  this.idArr.push(m.id);
                }
            });
        }
        else  
        {
          this.$message.error(res.data.returnMsg);
        }
      }); 
    },
    //通过子级的pid找到父级对应的id，制作树状图
    async toTree(selectedId) {
     
      await this.getdateDept()
      let data = this.json
      //console.log(data)

      // 删除 所有 children,以防止多次调用
      data.forEach(function (item) {
        delete item.children;
      });
             
      // 将数据存储为 以 id 为 KEY 的 map 索引数据列
      var map = {};
      data.forEach(function (item) {
        map[item.id] = item;
      });
      //console.log(map);
      var val = [];
      data.forEach(function (item) {
          // 以当前遍历项，的pid,去map对象中找到索引的id
          item.label = item.name;

          if (item.isLeaf == '0')
              item.icon = 'el-icon-thirdwenjianjia';
          else 
              item.icon = 'el-icon-thirdwenjianjia1';

          var parent = map[item.pid];
          // 好绕啊，如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
          if (parent) {
            (parent.children || ( parent.children = [] )).push(item);
          } else {
            //如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
            val.push(item);
          }
        });

      this.options =  val
    }
  }
};
</script>

<style>
  .el-input.el-input--suffix {
    cursor: pointer;

  }
  .el-input.el-input--suffix.rotate .el-input__suffix {
    transform: rotate(180deg);
  }
  .select-tree {
    max-height: 350px;
    overflow-y: scroll;
  }
  /* 菜单滚动条 */
  .select-tree::-webkit-scrollbar {
    z-index: 11;
    width: 6px;
  }
  .select-tree::-webkit-scrollbar-track,
  .select-tree::-webkit-scrollbar-corner {
    background: #fff;
  }
  .select-tree::-webkit-scrollbar-thumb {
    border-radius: 5px;
    width: 6px;
    background: #b4bccc;
  }
  .select-tree::-webkit-scrollbar-track-piece {
    background: #fff;
    width: 6px;
  }
</style>