<template>
    <div>
        <div class="headbar">
            不良缺陷记录
            <span class="pull-right" @click="closeMySelf"><i class="el-icon-error" style="font-size: 26px; margin-top: 6px"></i></span>
        </div>
        <el-form class="body" ref="refDefectinformation">
            <el-row type="center">
                <el-col :span="20">
                    <div
                        v-for="list in datalist"
                        :key="list.label"
                        v-bind:class="[list.selected ? 'selectdv' : 'unselectdv']"
                        @click="Choose(list, $event)"
                    >
                        {{ list.label }}
                    </div>
                </el-col>
                <el-col :span="4" style="text-align: right">
                    <el-button type="success" @click="confirm('请确认质量提报存在不合格项，是否提交?')"
                        ><i class="el-icon-circle-check"></i><br />保存</el-button
                    >
                    <el-button type="danger" @click="closeMySelf"><i class="el-icon-circle-close"></i><br />取消</el-button>
                </el-col>
            </el-row>
            <el-table
                ref="reftable"
                :data="zpData"
                border
                :height="vheight"
                :header-cell-style="{ textAlign: 'center' }"
                :default-sort="{ prop: 'errcode', order: 'descending' }"
                :row-class-name="rowClassName"
                @row-click="handleRowClickRole"
            >
                <el-table-column type="index" label="序号" width="55"> </el-table-column>
                <el-table-column prop="DefectionCode" label="缺陷编码" sortable> </el-table-column>
                <el-table-column prop="DefectionType" label="缺陷类型" sortable> </el-table-column>
                <el-table-column prop="Num" label="缺陷数量" width="202px">
                    <template slot-scope="scope">
                        <el-input-number
                            :controls="false"
                            placeholder=""
                            v-model="scope.row.Num"
                            @focus="PublicMethod.focus($event)"
                            v-show="scope.row.show"
                        ></el-input-number>
                        <span v-show="!scope.row.show">{{ scope.row.Num }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="Remark" label="缺陷描述" sortable> </el-table-column>
            </el-table>
        </el-form>
    </div>
</template>
<script>
export default {
    data() {
        return {
            editrow: null,
            vheight: '70vh',
            zpData: [
                {
                    xh: '1',
                    DefectionCode: '0001',
                    DefectionType: '外观问题',
                    Num: '1',
                    Remark: '备注1',
                    show: false
                },
                {
                    xh: '2',
                    DefectionCode: '0002',
                    DefectionType: '物流问题',
                    Num: '2',
                    Remark: '备注2',
                    show: false
                },
                {
                    xh: '3',
                    DefectionCode: '0003',
                    DefectionType: '设计问题',
                    Num: '4',
                    Remark: '备注3',
                    show: false
                }
            ],
            datalist: [
                {
                    label: '外观问题',
                    selected: true,
                    Remark: '外观问题备注'
                },
                {
                    label: '尺寸问题',
                    selected: false,
                    Remark: '尺寸问题备注'
                },
                {
                    label: '物流问题',
                    selected: true,
                    Remark: '物流问题备注'
                },
                {
                    label: '质量问题',
                    selected: false,
                    Remark: '质量问题备注'
                },
                {
                    label: '设计问题',
                    selected: true,
                    Remark: '设计问题备注'
                },
                {
                    label: '其他问题',
                    selected: false,
                    Remark: '质其他问题备注'
                }
            ]
        };
    },
    computed: {},
    methods: {
        //删除确认
        confirm(title) {
            this.$confirm('请确认质量提报存在不合格项，是否提交?', '信息提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    this.$message({
                        type: 'info',
                        message: '保存完成'
                    });
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消保存'
                    });
                });
        },
        //把每一行的索引放进row
        rowClassName({ row, rowIndex }) {
            row.index = rowIndex;
        },
        //行点击事件

        handleRowClickRole(row) {
            if (this.editrow != null) {
                this.editrow.show = false;
            }
            this.editrow = row;
            this.selectedRowChild = row;
            this.selectedIndexChild = row.index;
            this.$refs.reftable.toggleRowSelection(row);
            row.show = true;
            console.log(row.index);
        },
        //关闭当前页面
        closeMySelf() {
            //Object.assign(this.$data, this.$options.data())  // 避免替换实例根
            this.$emit('Defectinformation_form_close');
        },
        //点击缺陷类型，增加或删除行
        Choose(list, e) {
            if (e.currentTarget.getAttribute('class') == 'selectdv') {
                e.currentTarget.setAttribute('class', 'unselectdv');
                this.zpData.forEach((element, index) => {
                    if (element.DefectionType == list.label) {
                        this.zpData.splice(index, 1);
                        return false; //报错，就跳出循环
                    }
                });
            } else {
                e.currentTarget.setAttribute('class', 'selectdv');
                let row = {
                    xh: '',
                    DefectionCode: '0003',
                    DefectionType: list.label,
                    Num: '0',
                    Remark: list.Remark,
                    show:false
                };
                this.zpData.push(row);
            }
        }
    },
    mounted: function () {}
};
</script>
<style>
.text-right {
    text-align: right;
    margin-top: -30px;
}
</style>