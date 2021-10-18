<template>
	<el-dialog :close-on-click-modal="false" :visible.sync="visible" width="1250px" @close="OnClose()">
		<h2 class="headerNotice">
			<i class="el-icon-thirdkucun"></i>
			<span v-if="this.form.BenchmarkID === undefined || this.form.BenchmarkID === ''">添加点检基准信息</span><span v-else>编辑点检基准信息</span>
		</h2>
		<div style="height:150px; margin-top: 30px;">
			<el-form ref="form" :model="form" label-width="100px">			
				<div style="width: 100%;float: left;">
					<el-form-item label="基准编码：" class="blue">
						<el-input v-model="form.BenchmarkCode" v-bind:disabled="diasabledInput"></el-input>
					</el-form-item>
					<el-form-item label="编制日期：" class="blue">
						<el-input v-model="form.CreateDate"  v-bind:disabled="diasabledInput"></el-input>
					</el-form-item>	
					<el-form-item label="基准类型">
					    <el-select v-model="form.BenchmarkDefine"  @change="bindDev">
					        <el-option key="0" label="通用" value="0"></el-option>
					        <el-option key="1" label="专用" value="1"></el-option>
					    </el-select>
					</el-form-item>
					<el-form-item label="点检类型：" >					
						<el-select v-model="form.InvoiceType" >
							<el-option v-for="item in strListCheckOrderType" :label="item.SettingValue" :key="item.SettingNumber" :value="item.SettingNumber">
							
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="设备类型：" class="blue">
						<SelectTreeCategory ref="SelectTreeCategory" v-model="form.DevType" width="200" :props="defaultProps" placeholder="--设备类型--"></SelectTreeCategory>
					</el-form-item>					
					<el-form-item label="设备名称：" >
						<el-select v-model="form.DevID" placeholder="--设备名称--" filterable v-bind:disabled="BenchmarkDefineInput">
							<el-option v-for="item in strListDev" :label="item.DevNameNew" :key="item.DevID" :value="item.DevID" >
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="基准版本：" class="blue">
						<el-input v-model="form.Version"  ></el-input>
					</el-form-item>
					<el-form-item label="生效日期：" class="blue">
						 <el-date-picker v-model="form.ActiveDate" type="date" style="width:200px"></el-date-picker>
					</el-form-item>					
					
					<el-form-item label="备注说明：" >
						<el-input v-model="form.Remark" style="width:1100px" type="textarea" :rows="3"></el-input>
					</el-form-item>
				</div>
				
			</el-form>

		</div>
		<div slot="footer" class="bottom">
			<el-button @click="OnClose">取 消</el-button>
			<el-button type="primary" @click="OnSubmit()">确 定</el-button>
		</div>
	</el-dialog>
</template>

<script>
	import axios from 'axios';
	import SelectTreeCategory from '../../../publicAssembly/SelectTreeCategory.vue';

	import {
		showLoading,
		hideLoading
	} from '../../../../../assets/js/loading';

	export default {
		name: 'TemplateDialog',
		components: {
			//photoupload: photoupload,
			SelectTreeCategory: SelectTreeCategory,
			//VueCropper
		},
		props: {
			show: {
				type: Boolean,
				default: false
			} // 弹框可见标志
		},
		data: function() {
			return {
				// 默认选中值
				selected: '',
				// 弹框可见否标记
				visible: this.show,
				form: {
					BenchmarkCode: '',
					InvoiceType:'',
					BenchmarkDefine:'',
					ActiveDate:'',
					Version:'',
					Remark:'',
					DevID:'',
					CreateDate:''
				},
				diasabledInput: true, //设置人员编号不可编辑
				BenchmarkDefineInput:true,
				fileName: '',
				fileUrl: '',
				strListCheckOrderType: [], //点检类型下拉类表--搜索条件
				strListDev:[],//设备名称下拉列表
				// 数据默认字段---------------树
				defaultProps: {
					parent: 'parentId', // 父级唯一标识
					value: 'number', // 唯一标识
					label: 'label', // 标签显示
					children: 'children', // 子级
				}
			}
		},
	
		 computed: {
		    CategoryChange() {
		        return this.form.DevType
		    }
		  },
		  watch: {
			// 监听show,visible 随着show变化而变化
			show: {
			    immediate: true,
			    handler(show) {
			        this.visible = show;
			    }
			},
			//设备类型选择后设备名称联动
		    CategoryChange(CategoryCode) {
			   this.form.DevID ='';
		        let params = new URLSearchParams();
		        params.append('strWhere', " CategoryCode ='"+CategoryCode+"'");
				axios.post(EamWebApiUrl + '/EamDev/QueryDevDrowDownList', params).then((res) => {
		            if(res.data.returnCode=="1"){
		                this.strListDev = JSON.parse(res.data.returnData);
		            }
		            else  
		            {
		                this.$message.error(res.data.returnMsg);
		            }
		        });
		    }
		  },
		methods: {			
			//添加页面初始化
			addCheckBenchmarkInit() {
			   this.GetBenchmarkCode();
			   this.getCheckOrderType();//点检类型下拉列表
			   this.form.InvoiceType='';
			   this.form.BenchmarkDefine = '通用';
			   this.form.CreateDate=this.getNowDate();
			   this.form.ActiveDate=this.getNowDate();
			},
			EditCheckBenchmarkInit(selectedRow) {
			    this.editFlag = 2;
			    let params = new URLSearchParams();
			    this.NoticeForm.datatime = [selectedRow.StartDate, selectedRow.ExpireDate];
			    this.NoticeForm.titel = selectedRow.Title;
			    this.NoticeForm.desc = selectedRow.Describe;
			    this.fileUrl = selectedRow.AttUrl;
			    this.fileName = selectedRow.AttName;
			    this.Rank=selectedRow.Rank;
			    params.append('strWhere', "SettingKey='NoticeType'");
			    axios.post(BaseWebApiUrl + '/SysSetting/QuerySysSettingDrowDownList', params).then((res) => {
			        if (res.data.returnCode == '1') {
			            let data = JSON.parse(res.data.returnData);
			            this.SettingDrowDown = data;
			            this.NoticeForm.NoticeType = selectedRow.NoticeType;
			        } else {
			            this.$message.error(res.data.returnMsg);
			        }
			    });
			
			    this.$nextTick(() => {
			        setTimeout(() => {
			            this.$refs.myFileUpload.SetInput(selectedRow.AttUrl, selectedRow.AttName);
			        }, 10);
			    });
			},
			//基准编码生成--添加
			GetBenchmarkCode() {
				let params = new URLSearchParams();
				params.append('BenchmarkTypeString', "1");
						
				axios.post(EamWebApiUrl + '/EamBenchmark/GetBenchmarkCode', params).then((res) => {
					if (res.data.returnCode == '1') {
						this.form.BenchmarkCode = res.data.returnData;	
					} else {
						this.$message.error(res.data.returnMsg);
					}
				});
			},
			//当前日期获取的方法返回YYYY-MM-dd
			getNowDate() {
			      var date = new Date()
			      var seperator1 = '-'
			      var year = date.getFullYear()
			      var month = date.getMonth() + 1
			      var strDate = date.getDate()
			      if (month >= 1 && month <= 9) {
			        month = '0' + month
			      }
			      if (strDate >= 0 && strDate <= 9) {
			        strDate = '0' + strDate
			      }
			      var nowData = year + seperator1 + month + seperator1 + strDate
			      return nowData;
			},
			//点检类型的选择联动设备下拉是否可以使用
			bindDev(value){
				let getBenchmarkDefine=value;
				//0:通用，1：专用
				if (getBenchmarkDefine == "1") {	//、1：专用			                   
				     this.BenchmarkDefineInput = false;			                    
				  } else {//0:通用
					this.form.DevID ='';					
				     this.BenchmarkDefineInput = true;
				 }
				
			},
			//点检类型下拉列表
			getCheckOrderType() {
				let params = new URLSearchParams();
				params.append('strWhere', "SettingKey ='CheckOrderType'");
				axios.post(BaseWebApiUrl + '/SysSetting/QuerySysSettingDrowDownList', params).then((res) => {
					if (res.data.returnCode == '1') {
						this.strListCheckOrderType = JSON.parse(res.data.returnData);
			
					} else {
						this.$message.error(res.data.returnMsg);
					}
				});
			},
			//保存
			OnSubmit() {

				if (this.form.PersonCode == '' || this.form.PersonCode == undefined) {
					this.$message.warning('人员编码不允许为空');
					return false;
				}

				if (this.form.PersonName == '' || this.form.PersonName == undefined) {
					this.$message.warning('人员姓名不允许为空');
					return false;
				}

				if (this.form.PersonEmail != '' && this.form.PersonEmail != undefined) {
					var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
					if (!reg.test(this.form.PersonEmail)) {
						this.$message.warning('电子邮箱不正确');
						return false;
					}
				}

				if (this.form.DeptID == '' || this.form.DeptID == undefined) {
					this.$message.warning('所属部门不允许为空');
					return false;
				}

				if (this.form.LoginPwd == '' || this.form.LoginPwd == undefined) {
					this.$message.warning('登录密码不允许为空');
					return false;
				}

				if (this.form.PersonID == undefined) {
					let params = new URLSearchParams();

					let jsonData = JSON.stringify({
						PersonCode: this.form.PersonCode,
						PersonName: this.form.PersonName,
						LoginPwd: this.form.LoginPwd,
						PersonPhone: this.form.PersonPhone,
						PersonEmail: this.form.PersonEmail,
						PersonAdd: this.form.PersonAdd,
						DeptCode: this.form.DeptID,
						Remark: this.form.Remark,
						PersonStatus: this.form.PersonStatus == "在用" ? false : true,
						LoginTrue: this.form.LoginTrueValue == "允许" ? true : false,
						MobileLogin: this.form.MobileLogin == "允许" ? true : false,
						CreateUser: localStorage.getItem('ms_username'),
						CreateDate: new Date(),
						ModifyUser: localStorage.getItem('ms_username'),
						ModifyDate: new Date(),
						ImageUrl: this.fileUrl
					});

					params.append('json', jsonData);

					let json = JSON.stringify({
						IPAdd: '127.0.0.1',
						HostName: 'LEE',
						HostType: '0',
						MenuName: '人员账号管理',
						ObjectName: 'CreatPerson',
						CreateUser: localStorage.getItem('ms_username'),
						Operation: '〔添加〕人员账号：' + this.form.PersonCode + "-" + this.form.PersonName
					});

					params.append('Logjson', json);
					showLoading();
					axios.post(BaseWebApiUrl + '/Person/CreatPersonVUE', params).then((res) => {
						hideLoading();
						if (res.data.returnCode == '1') {
							this.$message.success("保存成功");
							this.$emit('addNewDomain', this.form);
						} else {
							this.$message.error(res.data.returnMsg);
						}
					});

				} else {
					let params = new URLSearchParams();

					let jsonData = JSON.stringify({
						PersonId: this.form.PersonID,
						PersonCode: this.form.PersonCode,
						PersonName: this.form.PersonName,
						LoginPwd: this.form.LoginPwd,
						PersonPhone: this.form.PersonPhone,
						PersonEmail: this.form.PersonEmail,
						PersonAdd: this.form.PersonAdd,
						DeptCode: this.form.DeptID,
						Remark: this.form.Remark,
						PersonStatus: this.form.PersonStatus == "在用" ? false : true,
						LoginTrue: this.form.LoginTrueValue == "允许" ? true : false,
						MobileLogin: this.form.MobileLogin == "允许" ? true : false,
						ModifyUser: localStorage.getItem('ms_username'),
						ModifyDate: new Date(),
						ImageUrl: null
					});

					params.append('json', jsonData);

					let json = JSON.stringify({
						IPAdd: '127.0.0.1',
						HostName: 'LEE',
						HostType: '0',
						MenuName: '人员账号管理',
						ObjectName: 'UpdatePerson',
						CreateUser: localStorage.getItem('ms_username'),
						Operation: '〔编辑〕人员账号：' + this.form.PersonCode + "-" + this.form.PersonName
					});

					params.append('Logjson', json);
					showLoading();
					axios.post(BaseWebApiUrl + '/Person/UpdatePersonVUE', params).then((res) => {
						hideLoading();
						if (res.data.returnCode == '1') {
							this.$message.success("保存成功");
							this.$emit('addNewDomain', this.form);
						} else {
							this.$message.error(res.data.returnMsg);
						}
					});
				}
			},
			//重置表单
			OnReset() {
				this.$refs.form.resetFields();
			},
			// 关闭弹框
			OnClose() {
				this.$emit('update:show', false); // 子组件更新弹框隐藏
				this.OnReset();
			},
			
			goBack() {
				this.$router.go(-1);
			}


		}
	}
</script>

<style>
	.headerNotice {
		height: 40px;
		margin-bottom: 5px;
		border-bottom: 1px solid #d5e3ef;
		font-size: 16px;
		color: #44bbbb;
	}

	.el-form-lable {
		float: left;
	}

	.el-dialog__body {
		padding-top: 0px;
	}

	.pre-img {
		width: 150px;
		height: 150px;
		margin-top: 11px;
		margin-left: 12px;
	}

	.crop-demo-btn {
		margin-top: 20px;
		margin-left: 42px;
	}

	.el-icon-lx-apps {
		color: #409EFF;
	}

	.switch {
		width: 200px;
	}
</style>
