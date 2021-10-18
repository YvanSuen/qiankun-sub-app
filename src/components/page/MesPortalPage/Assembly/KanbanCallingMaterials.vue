<template>
    <div>
        <div class="headbar">
            看板叫料<span class="pull-right" @click="closeMySelf"
                ><i class="el-icon-error" style="font-size: 26px; margin-top: 6px"></i
            ></span>
        </div>
        <div class="body">
            <div class="title">{{ title }}</div>
            <el-row>
                <el-col :span="7">
                    <el-input
                        class="textLarge"
                        placeholder="请扫描物料或包装盒"
                        suffix-icon="iconfontNew iconNew-Recode red"
                        v-model="QRcode"
                        style=""
                    >
                    </el-input>
                </el-col>
                <el-col :span="10">&nbsp;</el-col>
                <el-col :span="7" class="right">
                    <el-button type="success"><i class="el-icon-plus"></i><br />添加物料</el-button>
                    <el-button type="success"><i class="el-icon-phone"></i><br />确认叫料</el-button>
                    <el-button type="danger" @click="closeMySelf"><i class="el-icon-circle-close"></i><br />取消</el-button>
                </el-col>
            </el-row>
            <el-row :gutter="40" style="padding: 0px; margin: 0px; height: 760px; overflow-y: auto">
                <el-col :span="6" v-for="(item, i) in zpData" :key="i">
                    <el-card :body-style="{ padding: '20px' }" style="margin-top: 10px" v-bind:class="item.bgcolor">
                        <div class="center" style="border-bottom: solid 1px #dcdcdc; padding-bottom: 5px; font-size: 26px">
                            {{ item.code }}
                        </div>
                        <div style="margin-top: 10px">
                            <div class="text item">物料名称：{{ item.name }}</div>
                            <div class="text item">规格型号：{{ item.model }}</div>
                            <div class="text item">BOM数量：{{ item.bomnum }}</div>
                            <div class="text item">本次领用：</div>
                        </div>
                        <div class="center">
                            <el-input-number
                                class="textLarge"
                                :ref="`ref${i}`"
                                v-model="item.num"
                                @change="handleChange"
                                :min="0"
                                :max="item.bomnum"
                                label=""
                                @focus="PublicMethod.focus($event)"
                            ></el-input-number>
                            <el-button style="padding: 12px; margin-left: 1px" @click="cencle(i)"
                                ><i class="el-icon-close"></i>清零</el-button
                            >
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
export default {
    props: {},
    data() {
        return {
            QRcode: '',
            title: '当前料箱：WZ001（物料9种，共100件，其中关键件2种）',
            zpData: [
                {
                    code: '100313318',
                    name: '母线条',
                    model: '1P+AS',
                    bomnum: 40,
                    num: 10,
                    bgcolor: 'Green'
                },
                {
                    code: '100313317',
                    name: '封条',
                    model: '1P+AS',
                    bomnum: 30,
                    num: 9,
                    bgcolor: 'Blue'
                },
                {
                    code: '100313319',
                    name: '卡扣',
                    model: '1P+AS',
                    bomnum: 50,
                    num: 0,
                    bgcolor: ''
                },
                {
                    code: '100313418',
                    name: '端子槽',
                    model: '1P+AS',
                    bomnum: 40,
                    num: 5,
                    bgcolor: 'Blue'
                },
                {
                    code: '100313518',
                    name: '母线条',
                    model: '1P+AS',
                    bomnum: 40,
                    num: 20,
                    bgcolor: ' Green'
                },
                {
                    code: '100313318',
                    name: '导轨卡子',
                    model: '1P+AS',
                    bomnum: 40,
                    num: 20,
                    bgcolor: ' Green'
                },
                {
                    code: '100313318',
                    name: '端子槽',
                    model: '1P+AS',
                    bomnum: 40,
                    num: 20,
                    bgcolor: ' Blue'
                },
                {
                    code: '100313318',
                    name: '卡扣',
                    model: '1P+AS',
                    bomnum: 40,
                    num: 20,
                    bgcolor: ' Green'
                },
                {
                    code: '100313318',
                    name: '卡扣',
                    model: '1P+AS',
                    bomnum: 40,
                    num: 20,
                    bgcolor: ' Green'
                },
                {
                    code: '100313318',
                    name: '导轨卡子',
                    model: '1P+AS',
                    bomnum: 40,
                    num: 20,
                    bgcolor: ' Blue'
                },
                {
                    code: '100313318',
                    name: '导轨卡子',
                    model: '1P+AS',
                    bomnum: 40,
                    num: 20,
                    bgcolor: ' Green'
                },
                {
                    code: '100313318',
                    name: '导轨卡子',
                    model: '1P+AS',
                    bomnum: 40,
                    num: 20,
                    bgcolor: ''
                },
                {
                    code: '100313318',
                    name: '导轨卡子',
                    model: '1P+AS',
                    bomnum: 40,
                    num: 20,
                    bgcolor: ' Green'
                },
                {
                    code: '100313318',
                    name: '导轨卡子',
                    model: '1P+AS',
                    bomnum: 40,
                    num: 20,
                    bgcolor: ' Green'
                },
                {
                    code: '100313318',
                    name: '导轨卡子',
                    model: '1P+AS',
                    bomnum: 40,
                    num: 20,
                    bgcolor: ' Green'
                },
                {
                    code: '100313318',
                    name: '导轨卡子',
                    model: '1P+AS',
                    bomnum: 40,
                    num: 20,
                    bgcolor: ' Green'
                }
            ]
        };
    },

    methods: {
        closeMySelf() {
            this.$emit('KanbanCallingMaterials_form_close');
        },
        handleChange(value) {
            console.log(value);
            console.log(this.zpData);
        },
        cencle: function (i) {
          this.$refs[`ref${i}`][0].value=0;//特别注意不是单引号
          console.log(this.$refs[`ref${i}`]);
        }, 
    },
    components: {}
};
</script>