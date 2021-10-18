<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 备件类型管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-row :gutter="20">
                    <el-col :span="10">
                        <div
                            style="width:100%; background-color: #307ecc;height:30px; border:1px solid #307ecc; color:#ffffff;  font-size: 14px; line-height: 30px;"
                        >
                            &nbsp;
                            <b>备件类型</b>
                        </div>
                        <div
                            style="width:100%;height:600px;border:1px solid #307ecc;overflow-y:auto; "
                        >
                            <el-tree
                                :data="data"
                                :default-expand-all="true"
                                :props="defaultProps"
                                :expand-on-click-node="false"
                                @node-click="handleNodeClick"
                                :default-expanded-keys="idArr"
                                :render-content="renderContent"
                            ></el-tree>
                        </div>
                    </el-col>
                    <el-col :span="13">
                        <div
                            style="width:100%; background-color: #307ecc;height:30px; border:1px solid #307ecc;  color:#ffffff; font-size: 14px; line-height: 30px;"
                        >
                            &nbsp;
                            <b>备件类型信息</b>
                        </div>
                        <div style="width:100%;height:600px;border:1px solid #307ecc;">
                            <el-form ref="form" status-icon style="margin-top: 100px;margin-left: 120px;">
                                 <el-form-item label="类型编码：">
                                    <el-input v-model="txtCategoryCodeV" class="handle-input-edit" disabled></el-input>
                                </el-form-item>
                                <el-form-item label="备件类型：">
                                    <el-input v-model="txtCategoryNameV" class="handle-input-edit" disabled></el-input>
                                </el-form-item>
                                  <el-form-item label="备注说明：">
                                    <el-input v-model="Remark" type="textarea" :rows="4" class="handle-input-edit"  disabled></el-input>
                                </el-form-item>
                            </el-form>
                        </div>
                    </el-col>
                    <el-col :span="23">
                        <div
                            style="width:100%;  height:60px;  color:#ffffff; font-size: 18px; line-height: 60px;"
                        >
                            <div class="handle-box" style="float:right; margin-right: 5px;">
                                <el-button
                                    type="primary"
                                    icon="el-icon-thirdbtnrestore"
                                    @click="handleDelete"
                                >删除</el-button>
                            </div>
                            <div class="handle-box" style="float:right; margin-right: 5px;">
                                <el-button
                                    type="primary"
                                    icon="el-icon-thirdbtnEdit"
                                    @click="handleEdit"
                                >修改</el-button>
                            </div>
                            <div class="handle-box" style="float:right;margin-right: 5px;">
                                <el-button
                                    type="primary"
                                    icon="el-icon-thirdiconfontunie042"
                                    @click="handleAdd"
                                >新增</el-button>
                            </div>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>

        <!-- 编辑弹出框 -->
      <addOrEdit  ref="addOrEdit" :show.sync="addOrEditVisible"  @addNewDomain="createNewDomain" > </addOrEdit>
    </div>
</template>



<script>
import axios from 'axios';
import AddOrEdit from './PartsCategoryEdit'

export default {
    components: {
       addOrEdit:AddOrEdit
    },
    name: 'basetable',
    data() {
        return {
            txtCategoryCodeV:'',
            txtCategoryNameV:'',
            Remark:'',
            selectedNode:{},
            data: [],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            addOrEditVisible:false,//编辑对话框
            idArr: []
        };
    },
    mounted: function () {},
    created() {
        this.getTreeData();
    },
    methods: {
        renderContent(h, { node, data, store }) {
            return (
                <span>
                    <i class={data.icon}></i>
                    <span> {node.label}</span>
                </span>
            );
        },
        handleNodeClick(data) {
            this.txtCategoryCodeV = data.number
            this.txtCategoryNameV = data.name
            this.Remark = data.remark

            this.selectedNode = data
        },
        getTreeData() {
            let params = new URLSearchParams();
            params.append('strWhere', 'where 1=1');
            axios.post(EAMWebApiUrl + '/EamPartsCode/QueryList', params).then((res) => {
                if (res.data.returnCode == '1') {
                    let dataTree = JSON.parse(res.data.returnData);
                    this.data = this.toTree(dataTree);
                     dataTree.forEach((m) => {
                        if (m.open == 'true') {
                            this.idArr.push(m.id);
                        }
                    });
                } else {
                    this.$message.error(res.data.returnMsg);
                }
            });
        },

        toTree(data) {
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

                if (item.pId == '00000000-0000-0000-0000-000000000000') 
                    item.icon = 'el-icon-thirdwenjianjia';
                else 
                    item.icon = 'el-icon-thirdwenjianjia1';

                var parent = map[item.pId];
                // 好绕啊，如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
                if (parent) {
                    (parent.children || (parent.children = [])).push(item);
                } else {
                    //如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级

                    val.push(item);
                }
            });
            return val;
        },
        
        // 删除操作
        handleDelete() {
            if(this.selectedNode.name == undefined)
            {
                this.$message.warning('请选择要操作的节点');
                return false;
            }

            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    let params = new URLSearchParams();

                let jsonData = JSON.stringify({
                    RoleID : this.selectedNode.id,
                    RoleName : this.selectedNode.name
                });

                params.append('json', jsonData);


                    let json = JSON.stringify({
                        IPAdd: localStorage.getItem('IPAdd'),
                        HostName: localStorage.getItem('HostName'),
                        MenuName: '备件类型管理',
                        ObjectName: 'DeleteEamParts',
                        CreateUser: localStorage.getItem('ms_username'),
                        Operation:
                            '〔删除〕备件类型：' +
                            this.selectedNode.number +
                            '-' +
                            this.selectedNode.name
                    });
                    params.append('Logjson', json);
                    axios.post(EAMWebApiUrl + '/EamPartsCode/Delete', params).then((res) => {
                        if (res.data.returnCode == '1') {
                            this.$message.success('删除成功');
                            this.clear()
                        } else {
                            this.$message.error(res.data.returnMsg);
                        }
                    });
                })
                .catch(() => {});
        },
        handleEdit() {

            if(this.selectedNode.name == undefined)
            {
                this.$message.warning('请选择要操作的节点');
                return false;
            }
            
            this.addOrEditVisible = true
            this.$refs.addOrEdit.addPerson(this.selectedNode);
        },
        handleAdd() {
            
            this.addOrEditVisible = true
            this.$refs.addOrEdit.addPerson({});
        },
        clear(){
            this.selectedNode = {}
            this.txtCategoryCodeV = ''
            this.txtCategoryNameV = ''
            this.Remark = ''
            this.getTreeData();

        },
        createNewDomain(domainForm) {
            this.loading = true
            this.addOrEditVisible = false
            this.clear()
        },
       
    }
};
</script>

<style>
    .el-tree-node:focus > .el-tree-node__content {
        background-color: #409EFF !important;
    }

</style>
