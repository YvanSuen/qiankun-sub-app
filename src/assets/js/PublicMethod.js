import Vue from 'vue';

export default{
//函数方法
focus(event){
  event.currentTarget.select();
},
reset(formRef, ...excludeFields){
  this.$refs[formRef].resetFields();
  let obj1 = this.$data;
  let obj2 = this.$options.data.call(this);
  if (!excludeFields || excludeFields.length === 0) {
    excludeFields = ["ruleValidate"];
  }
  for (let attrName in obj1) {
    if (excludeFields && excludeFields.includes(attrName)) {
      continue;
    }
    obj1[attrName] = obj2[attrName];
  }
}
};

