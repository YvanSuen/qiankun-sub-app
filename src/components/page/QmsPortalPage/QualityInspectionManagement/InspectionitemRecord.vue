<template>
    <div>
        <div class="headbar">
            检验项目记录
            <span class="pull-right" @click="closeMySelf"><i class="el-icon-error" style="font-size: 26px; margin-top: 6px"></i></span>
        </div>
        <div class="body text">
            <div>
                <el-row type="center">
                    <el-col :span="10">
                        检验内容：横向尺寸检查<br />
                        检验方法：仪器测量<br />
                    </el-col>
                    <el-col :span="10">
                        检验标准：尺寸符合图纸要求<br />
                        上&nbsp; 下 &nbsp;限：10 -- 15 <br />
                    </el-col>
                    <el-col :span="4" style="text-align: right">
                        <el-button type="danger"><i class="el-icon-document"></i><br />NG</el-button>
                        <el-button type="success"><i class="el-icon-circle-check"></i><br />ok</el-button>
                        <el-button type="danger" @click="closeMySelf"><i class="el-icon-circle-close"></i><br />取消</el-button>
                    </el-col>
                </el-row>
                <div>
                    实&nbsp; 际 &nbsp;值：<el-input v-model="iSjnum" placeholder="" style="width: 80px">15</el-input
                    ><el-input v-model="iSjz" placeholder="" style="width: 80%;margin-left:20px"></el-input>
                </div>
            </div>
            <div style="margin-top: 10px">
                <div class="headbar">实际值</div>
                <el-card>
                    <el-input-number
                         :controls=false
                         v-for="(o, index) in Num"
                        :key="o"
                        class="text item"
                        placeholder=""
                        v-model="trueval[index].value"
                        style="width: 120px;margin-left:20px;margin-right:20px"
                        @keyup.native="ChangeClass($event)"
                        @focus="PublicMethod.focus($event)"
                    ></el-input-number>
                </el-card>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        Num: Number
    },

    data() {
        return {
            iSjnum: '15',
            iSjz: '15，12,13,15',
            trueval: [],
        };
    },
   created: function () {
        for (var i = 0; i < this.Num; i++) {
            var item = { value: '10' };
            this.trueval.push(item);
        }
    },
    computed: {},
    methods: {
        closeMySelf() {
            this.$emit('Inspectionitemrecord_form_close');
        },
        handleChange(val) {
            console.log(val);
        },
        ChangeClass(e) {
            var val=parseFloat(e.target.value);
            if(val>15)
            {
               e.currentTarget.setAttribute("class","RedInput el-input-number el-input-number--big is-without-controls");
            }
            else if(val<10)
            {
                  e.currentTarget.setAttribute("class","YellowInput el-input-number el-input-number--big is-without-controls");
            }
            else
            {
               e.currentTarget.setAttribute("class","text item el-input-number el-input-number--big is-without-controls");
            }
        }
    },
    mounted: function () {
        //页面加载后时执行
        // bb();
    },

    components: {}
};

export function bb() {
    let aa = localStorage.getItem('ms_username');
}
</script>
<style>
.text-right {
    text-align: right;
    margin-top: -30px;
}
</style>