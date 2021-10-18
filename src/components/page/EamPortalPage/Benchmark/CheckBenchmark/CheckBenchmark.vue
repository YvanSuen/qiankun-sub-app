<template>
	<div>
		<div class="container">
			<div class="handle-box">
				<div class="sel">
					<el-select v-model="query.BenchmarkDefine" placeholder="--基准类型--" class="handle-select mr10">
						<el-option key="0" label="通用" value="False"></el-option>
						<el-option key="1" label="专用" value="False"></el-option>
					</el-select>
					<el-select v-model="query.Status" placeholder="--基准状态--" class="handle-select mr10">
						<el-option key="0" label="未提交" value="False"></el-option>
						<el-option key="1" label="已退回" value="False"></el-option>
						<el-option key="2" label="已提交" value="False"></el-option>
						<el-option key="5" label="已审核" value="False"></el-option>
						<el-option key="8" label="已失效" value="False"></el-option>
					</el-select>
					<el-select v-model="query.InvoiceType" placeholder="--点检类型--" class="handle-select mr10">
						<el-option v-for="item in strListCheckOrderType" :label="item.SettingValue" :key="item.SettingNumber" :value="item.SettingNumber">
						</el-option>
					</el-select>
					<SelectTreeCategory ref="SelectTreeCategory" v-model="query.DevType" width="130" :props="defaultProps" placeholder="--设备类型--"></SelectTreeCategory>
				</div>
				<el-input v-model="query.BenchmarkCode" placeholder="--基准编码--" class="handle-input mr10"></el-input>
				<el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
				<el-button type="primary" icon="el-icon-thirdbtn-refresh" @click="handleReset">重置</el-button>
			</div>
			<div class="handle-box" style="float:right;">
				<el-button type="primary" icon="el-icon-thirdiconfontunie042" @click="handleAdd">添加</el-button>
				<el-button type="primary" icon="el-icon-thirdbtnEdit" @click="handleEdit">编辑</el-button>
				<el-button type="primary" icon="el-icon-thirdbtnrestore" @click="handleDelete">删除</el-button>
				<!--<el-button type="primary" icon="el-icon-lx-delete" @click="handleDelete">删除</el-button>-->
			</div>
			<el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header"
			 :row-class-name="tableRowClassName" @row-click="onRowClick">
				<el-table-column prop="BenchmarkID" v-if=false label="BenchmarkID" align="center"></el-table-column>
				<el-table-column prop="DevID" v-if=false label="DevID"></el-table-column>
				<el-table-column prop="CategoryCode" v-if=false label="CategoryCode"></el-table-column>
				<el-table-column prop="Row" v-if=false label="RowID"></el-table-column>
				<el-table-column prop="BenchmarkCode" label="基准编号" width="140"></el-table-column>
				<el-table-column prop="BenchmarkDefineCN" label="基准类型"></el-table-column>
				<el-table-column prop="InvoiceType" v-if=false label="InvoiceType"></el-table-column>
				<el-table-column prop="InvoiceTypeStr" label="点检类型"></el-table-column>
				<el-table-column prop="CategoryID" v-if=false label="CategoryID"></el-table-column>
				<el-table-column prop="CategoryName" label="设备类型"></el-table-column>
				<el-table-column prop="DevCode" label="规格型号" width="150"></el-table-column>
				<el-table-column prop="DevModel" label="设备名称" width="140"></el-table-column>
				<el-table-column prop="Version" label="基准版本"></el-table-column>
				<el-table-column prop="ActiveDate" label="生效日期" width="100"></el-table-column>
				<el-table-column prop="CreateUser" label="编制人员"></el-table-column>
				<el-table-column prop="CreateDate" label="编制日期" width="100"></el-table-column>
				<el-table-column prop="Remark" label="备注说明"></el-table-column>
				<el-table-column prop="StatusCN" v-if=false label="基准状态H"></el-table-column>
				<!-- <el-table-column prop="Status" label="基准状态"></el-table-column>
				 8:已失效
				 5:已审核
				 2:已提交
				 1:已退回
				 0:未提交
				 -->
				<el-table-column prop="Status" label="基准状态">
					<template scope="scope">
						<span v-if="scope.row.Status==0" style="color:#1E1E1E">未提交</span>
						<span v-else-if="scope.row.Status==1" style="color:#CC00FF">已退回</span>
						<span v-else-if="scope.row.Status==2" style="color:#0000FF">已提交</span>
						<span v-else-if="scope.row.Status==5" style="color:#008000">已审核</span>
						<span v-else-if="scope.row.Status==8" style="color:#FF0000">已失效</span>
						<span v-else></span>
					</template>
				</el-table-column>
				<!-- <el-table-column label="基准状态" align="center">
					<template slot-scope="scope">
						<el-tag :type="scope.row.Status===8?'danger':
						              scope.row.Status===5?'success':
									  scope.row.Status===2?'info':
									  scope.row.Status===1?'warning':
									  scope.row.Status===0?'info':''
							   ">
							{{scope.row.StatusCN}}
						</el-tag>
					</template>
				</el-table-column> -->
				<el-table-column prop="Status" v-if=false label="Status"></el-table-column>
			</el-table>
			<div class="pagination">
				<el-pagination background layout="total, prev, pager, next" :current-page="query.pageIndex" :page-size="query.pageSize"
				 :total="pageTotal" @current-change="handlePageChange"></el-pagination>
			</div>
			<!-- 子grid -->
			<div class="handle-box" style="float:right;">
				<el-button type="primary" icon="el-icon-thirdiconfontunie042" @click="handleAddChild">添加</el-button>
				<el-button type="primary" icon="el-icon-thirdbtnEdit" @click="handleEditChild">编辑</el-button>
				<el-button type="primary" icon="el-icon-thirdbtnrestore" @click="handleDeleteChild">删除</el-button>
			</div>
			<el-table :data="tableDataChild" border class="table" ref="multipleTableChild" header-cell-class-name="table-header"
			 :row-class-name="tableRowClassNameChild" @row-click="onRowClickChild">
				<el-table-column prop="DetailID" v-if=false label="DetailID" width="55" align="center"></el-table-column>
				<el-table-column prop="BenchmarkID" v-if=false label="BenchmarkID" width="55" align="center"></el-table-column>
				<el-table-column prop="ItemNumber" label="序号"></el-table-column>
				<!-- <el-table-column prop="DevName" label="设备名称" width="200" show-overflow-tooltip>
					<template slot-scope="scope">
						<a target="_blank" class="buttonText" @click="openParts(scope.row.DevID,2)">{{scope.row.DevName}}</a>
					</template>
				</el-table-column> -->
				<el-table-column prop="SplitName" label="点检部位"></el-table-column>
				<el-table-column prop="ItemType" label="项目类型"></el-table-column>
				<el-table-column prop="ItemContent" label="点检内容"></el-table-column>
				<el-table-column prop="ItemMethod" label="点检方法"></el-table-column>
				<el-table-column prop="ItemStandard" label="点检标准"></el-table-column>
				<el-table-column prop="Frequent" label="点检频率"></el-table-column>
				<el-table-column prop="FrequentType" v-if=false label="FrequentType"></el-table-column>
				<el-table-column prop="FrequentValue" v-if=false label="FrequentValue"></el-table-column>
				<el-table-column prop="StandardValue" label="标准值"></el-table-column>
				<el-table-column prop="UpperLower" label="上下限值"></el-table-column>
				<el-table-column prop="ValueLower" v-if=false label="ValueLower"></el-table-column>
				<el-table-column prop="ValueUpper" v-if=false label="ValueUpper"></el-table-column>
				<el-table-column prop="WorkHours" label="标准工时"></el-table-column>
				<el-table-column prop="MustInputCN" label="结果必填"></el-table-column>
				<el-table-column prop="MustInput" v-if=false label="MustInput"></el-table-column>
				<el-table-column prop="MustReviewCN" label="需要验收"></el-table-column>
				<el-table-column prop="MustReview" v-if=false label="MustReview"></el-table-column>
				<el-table-column prop="Remark" label="备注说明"></el-table-column>
				<el-table-column prop="ImageUrl" v-if=false label="ImageUrl"></el-table-column>
			</el-table>
			<div class="pagination">
				<el-pagination background layout="total, prev, pager, next" :current-page="query.pageIndexChild" :page-size="query.pageSize"
				 :total="pageTotalChild" @current-change="handlePageChangeChild"></el-pagination>
			</div>

		</div>

		<!-- 编辑弹出框 -->
		<addOrEdit ref="addOrEdit" :show.sync="addOrEditVisible" @addNewDomain="createNewDomain"> </addOrEdit>


	</div>
</template>

<script>
	import axios from 'axios';
	import {
		log
	} from 'util';
	import AddOrEdit from './CheckBenchmarkEdit';
	import SelectTreeCategory from '../../../publicAssembly/SelectTreeCategory.vue';

	export default {
		components: {
			addOrEdit: AddOrEdit,
			SelectTreeCategory: SelectTreeCategory
		},
		name: 'basetable',
		data() {
			return {
				query: {
					BenchmarkDefine: '',
					Status: '',
					InvoiceType: '',
					BenchmarkCode: '',
					DevType: '',
					pageIndex: 1,
					pageSize: 5,
					pageIndexChild: 1 //第二个grid
				},
				strListCheckOrderType: [], //点检类型下拉类表--搜索条件
				tableData: [],
				tableDataChild: [], //第二个grid
				multipleSelection: [],
				delList: [],
				pageTotal: 0,
				pageTotalChild: 0, //第二个grid
				form: {
					PersonStatus: '在用',
					LoginTrueValue: '允许',
					MobileLogin: '允许'
				},
				idx: -1,
				id: -1,
				addOrEditVisible: false, //编辑对话框
				selectedIndex: -1, // 用于存放被选中行的index
				selectedRow: {}, // 用于存放被选中行
				selectedIndexChild: -1, // 用于存放被选中行的index         第二个grid
				selectedRowChild: {}, // 用于存放被选中行        第二个grid

				// 数据默认字段
				defaultProps: {
					parent: 'parentId', // 父级唯一标识
					value: 'id', // 唯一标识
					label: 'label', // 标签显示
					children: 'children', // 子级
				}
			};
		},
		created() {
			this.getCheckOrderType();
			this.getData('T.BenchmarkType=1'); //基准类型：1点检2润滑3保养
		},
		methods: {
			//点检类型下拉类表--搜索条件
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
			// 获取 easy-mock 的模拟数据
			getData(strWhere) {
				let params = new URLSearchParams();
				params.append("strWhere", strWhere)
				params.append("Rows", this.query.pageSize)
				params.append("CurrentPage", this.query.pageIndex)
				params.append("sidx", 'T.CreateDate')
				params.append("sord", 'desc')

				axios.post(EamWebApiUrl + "/EamBenchmark/QueryBenchmarkList", params).then((res) => {
					if (res.data.returnCode == "1") {
						let json = JSON.parse(res.data.returnData);
						//console.log(JSON.parse(res.data.returnData));
						this.tableData = json.rows;
						this.pageTotal = json.records;
					} else {
						this.$message.error(res.data.returnMsg);
					}
				});
			},
			getDataChild(strWhere) {
				let params = new URLSearchParams();

				params.append("strWhere", strWhere)
				params.append("Rows", this.query.pageSize)
				params.append("CurrentPage", this.query.pageIndexChild)
				params.append("sidx", 'ItemNumber')
				params.append("sord", 'asc')

				axios.post(EamWebApiUrl + "/EamBenchmark/QueryBenchmarkDetailList", params).then((res) => {
					if (res.data.returnCode == "1") {
						let json = JSON.parse(res.data.returnData);
						//console.log(JSON.parse(res.data.returnData));
						this.tableDataChild = json.rows;
						this.pageTotalChild = json.records || this.query.pageSize
					} else {
						this.$message.error(res.data.returnMsg);
					}
				});
			},
			//选中一行
			onRowClick(row, event, column, cell) {
				this.selectedRow = row
				this.selectedIndex = row.index

				this.$refs.multipleTable.toggleRowSelection(row);

				let strWhere = " T.BenchmarkID ='" + row.BenchmarkID + "'"

				this.getDataChild(strWhere)
			},
			//选中子gird
			onRowClickChild(row, event, column, cell) {
				this.selectedRowChild = row
				this.selectedIndexChild = row.index

				this.$refs.multipleTableChild.toggleRowSelection(row)
			},
			tableRowClassName({row,rowIndex}) {
				//把每一行的索引放进row
				row.index = rowIndex;
				let color = "myRowClassUn";

				if (this.selectedIndex == rowIndex)
					color = "myRowClass";

				return color;
			},
			tableRowClassNameChild({row,rowIndex}) {
				//把每一行的索引放进row
				row.index = rowIndex;
				let color = "myRowClassUn";

				if (this.selectedIndexChild == rowIndex)
					color = "myRowClass";

				return color;
			},
			// 触发搜索按钮
			handleSearch() {
				this.$set(this.query, 'pageIndex', 1);
				let strWhere = 'T.BenchmarkType=1'
				//基准类型
				if (this.query.BenchmarkDefine != '')
					strWhere = strWhere + " and T.BenchmarkDefine ='" + this.query.BenchmarkDefine + "'"
				//基准状态
				if (this.query.Status != '')
					strWhere = strWhere + " and T.Status ='" + this.query.Status + "'"
				//点检类型
				if (this.query.InvoiceType != '')
					strWhere = strWhere + " and T.InvoiceType ='" + this.query.InvoiceType + "'"
				//基准编码
				if (this.query.BenchmarkCode != '')
					strWhere = strWhere + " and T.BenchmarkCode Like N'%" + this.query.BenchmarkCode + "%'"
				//设备类型 TODO
				if (this.query.DevType != '')
					strWhere = strWhere + " and T.CategoryID ='" + this.query.DevType + "'"

				this.getData(strWhere);
			},
			// 分页导航
			handlePageChangeChild(val) {
				this.$set(this.query, 'pageIndexChild', val);

				let strWhere = " A.CellCode ='" + this.selectedRow.CellCode + "'"

				this.getDataChild(strWhere)
			},
			//重置查询条件
			handleReset() {
				this.query.BenchmarkDefine = ''
				this.query.Status = '';
				this.query.InvoiceType = '';
				this.query.BenchmarkCode = '';
				this.query.DevType = '';

				this.$set(this.query, 'pageIndex', 1);
				this.getData('T.BenchmarkType=1');
			},
			// 分页导航
			handlePageChange(val) {
				this.$set(this.query, 'pageIndex', val);
				let strWhere = 'T.BenchmarkType=1'
				//基准类型
				if (this.query.BenchmarkDefine != '')
					strWhere = strWhere + " and T.BenchmarkDefine ='" + this.query.BenchmarkDefine + "'"
				//基准状态
				if (this.query.Status != '')
					strWhere = strWhere + " and T.Status ='" + this.query.Status + "'"
				//点检类型
				if (this.query.InvoiceType != '')
					strWhere = strWhere + " and T.InvoiceType ='" + this.query.InvoiceType + "'"
				//基准编码
				if (this.query.BenchmarkCode != '')
					strWhere = strWhere + " and T.BenchmarkCode Like N'%" + this.query.BenchmarkCode + "%'"
				//设备类型 TODO
				if (this.query.DevType != '')
					strWhere = strWhere + " and T.CategoryID ='" + this.query.DevType + "'"

				this.getData(strWhere);
			},
			// 添加操作
			handleAdd() {
				this.$refs.addOrEdit.addCheckBenchmarkInit();
				this.addOrEditVisible=true;
				//this.GetBenchmarkCode();//基准编码生成
				
			},
			//基准编码生成--添加
			GetBenchmarkCode() {
				let params = new URLSearchParams();
				params.append('BenchmarkTypeString', "1");
						this.$refs.addOrEdit.form.ActiveDate=this.getNowFormatDate();
				axios.post(EamWebApiUrl + '/EamBenchmark/GetBenchmarkCode', params).then((res) => {
					if (res.data.returnCode == '1') {
						this.form.BenchmarkCode = res.data.returnData;	
					} else {
						this.$message.error(res.data.returnMsg);
					}
				});
			},
			getNowFormatDate() {
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
			//编辑操作
			handleEdit() {
				if (this.selectedIndex == -1)
					this.$message.warning('请选择要编辑的数据')
				else {
					this.addOrEditVisible = true
					this.$refs.addOrEdit.EditCheckBenchmarkInit(this.selectedRow)
				}
			},
			//删除操作
			handleDelete() {
				if (this.selectedIndex == -1) {
					this.$message.warning('请选择要删除的数据');
					return false;
				}
				// 确认删除
				this.$confirm('确定要删除吗？', '提示', {
						type: 'warning'
					})
					.then(() => {
						let params = new URLSearchParams();
						var strWhere = " PersonID in ('" + this.selectedRow.BenchmarkID + "')";
						params.append('strDel', strWhere);

						let json = JSON.stringify({
							IPAdd: '127.0.0.1',
							HostName: 'LEE',
							HostType: '0',
							MenuName: '点检基准管理',
							ObjectName: 'DeletePerson',
							CreateUser: localStorage.getItem('ms_username'),
							Operation: '〔删除〕点检基准：' + this.selectedRow.BenchmarkCode
						});
						params.append('Logjson', json);
						axios.post(BaseWebApiUrl + '/Person/DeletePerson', params).then((res) => {
							if (res.data.returnCode == '1') {
								this.$message.success('删除成功');
								this.handleSearch()

							} else {
								this.$message.error(res.data.returnMsg);
							}
						});
					})
					.catch(() => {});
			},
			handleAddChild() {

			},
			handleEditChild() {

			},
			handleDeleteChild() {

			},
			createNewDomain(domainForm) {
				this.loading = true
				this.addOrEditVisible = false
				this.selectedIndex = -1
				this.selectedRow = {}
				if (domainForm.CreateDate == undefined)
					this.handleReset()
			},
			goBack() {
				this.$router.go(-1);
			}
		}
	}
</script>

<style>
	.sel {
		float: left;
		margin-top: 2px;
	}

	.sel .el-input {
		margin-right: 10px;
	}
</style>
