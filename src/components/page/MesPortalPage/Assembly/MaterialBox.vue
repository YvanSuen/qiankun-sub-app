<template>
    <div>
        <div class="headbar">
            料箱物料信息<span class="pull-right" @click="closeMySelf"
                ><i class="el-icon-error" style="font-size: 26px; margin-top: 6px"></i
            ></span>
        </div>
        <div style="padding: 10px">
            <div class="title">{{ title }}</div>
            <el-row>
                <el-col :span="7">
                    <el-input
                        placeholder="再次扫描料箱号关闭当前窗口"
                        suffix-icon="iconfontNew iconNew-Recode red"
                        v-model="QRcode"
                        
                    >
                    </el-input> </el-col
            ></el-row>
            <el-row :gutter="40"  style="padding: 0px; margin: 0px; height: 750px; overflow-y: auto">
                <el-col :span="6" v-for="(item, i) in zpData" :key="i" >
                    <el-card :body-style="{ padding: '20px' }" style="margin-top: 10px" v-bind:class="item.bgcolor">
                        <div class="center" style="border-bottom: solid 1px #dcdcdc; padding-bottom: 5px; font-size: 26px">
                            {{ item.code }}
                        </div>
                        <div style=" margin-top: 10px">
                            <div class="text item">物料名称：{{ item.name }}</div>
                            <div class="text item">规格型号：{{ item.model }}</div>
                            <div class="text item">本次数量：</div>
                            <div class="center" style="font-size: 30px">
                                {{ item.num }}
                            </div>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        FID: String
    },
    data() {
        return {
            QRcode:'',
            title: '当前料箱：WZ001（物料9种，共100件，其中关键件2种）',
            zpData: [
                {
                    code: '100313318',
                    name: '导轨卡子',
                    model: '导轨卡子A002',
                    num: '20',
                    bgcolor: 'Green'
                },
                {
                    code: '100313318',
                    name: '导轨卡子',
                    model: '导轨卡子A002',
                    num: '20',
                    bgcolor: 'Blue'
                },
                {
                    code: '100313318',
                    name: '导轨卡子',
                    model: '导轨卡子A002',
                    num: '20',
                    bgcolor: ''
                },
                {
                    code: '100313318',
                    name: '导轨卡子',
                    model: '导轨卡子A002',
                    num: '20',
                    bgcolor: 'Blue'
                },
                {
                    code: '100313318',
                    name: '导轨卡子',
                    model: '导轨卡子A002',
                    num: '20',
                    bgcolor: ' Green'
                },
                {
                    code: '100313318',
                    name: '导轨卡子',
                    model: '导轨卡子A002',
                    num: '20',
                    bgcolor: ' Green'
                },
                {
                    code: '100313318',
                    name: '导轨卡子',
                    model: '导轨卡子A002',
                    num: '20',
                    bgcolor: ' Blue'
                },
                {
                    code: '100313318',
                    name: '导轨卡子',
                    model: '导轨卡子A002',
                    num: '20',
                    bgcolor: ' Green'
                },
                {
                    code: '100313318',
                    name: '导轨卡子',
                    model: '导轨卡子A002',
                    num: '20',
                    bgcolor: ' Green'
                },
                {
                    code: '100313318',
                    name: '导轨卡子',
                    model: '导轨卡子A002',
                    num: '20',
                    bgcolor: ' Blue'
                },
                {
                    code: '100313318',
                    name: '导轨卡子',
                    model: '导轨卡子A002',
                    num: '20',
                    bgcolor: ' Green'
                },
                {
                    code: '100313318',
                    name: '导轨卡子',
                    model: '导轨卡子A002',
                    num: '20',
                    bgcolor: ''
                },
                {
                    code: '100313318',
                    name: '导轨卡子',
                    model: '导轨卡子A002',
                    num: '20',
                    bgcolor: ' Green'
                },
                {
                    code: '100313318',
                    name: '导轨卡子',
                    model: '导轨卡子A002',
                    num: '20',
                    bgcolor: ' Green'
                },
                {
                    code: '100313318',
                    name: '导轨卡子',
                    model: '导轨卡子A002',
                    num: '20',
                    bgcolor: ' Green'
                },
                {
                    code: '100313318',
                    name: '导轨卡子',
                    model: '导轨卡子A002',
                    num: '20',
                    bgcolor: ' Green'
                }
            ]
        };
    },

    methods: {
        closeMySelf() {
            this.$emit('MaterialBox_form_close');
        }
    },
    components: {}
};
</script>