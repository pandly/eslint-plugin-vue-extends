<template>
  <div>
    <div :style="style"></div>
    <div :class="{'active': list[0], 'name': `${userInfo.number || ''}`}">{{ person.name.address }}</div>
    <div :class="[scrollHeight > 0 ? 'edu-shadow':'', 'edu']"></div>
    <div v-if="!noWorkflow"></div>
    <div v-if="loginType !== 'phone'"></div>
    <div v-if="arr.includes(summary)"></div>
    <div v-if="Object.keys(currentNode).length"></div>
    <div>{{ loading ? `${totalTime}s` : flag ? '222' : '333' }}</div>
    <div :reset-data="JSON.parse(JSON.stringify(resetData))"></div>
    <div v-if="hasLogin && $route.meta.hasLogin && !isUplus && obj.name.age"></div>
    <div v-if="editType === 'user' && curNode.line_level !== 1 || editType === 'add'"></div>
    <div v-for="item in list.slice(0, count)" :key="item.id.aaa">{{ item.abc.aaa }}</div>
    <div>{{ corp | setName(corpNames) }}</div>
    <div>{{ dayjs() }}</div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      style: {},
      list: [],
      scrollHeight: 0,
      person: null,
      noWorkflow: false,
      loginType: 'phone',
      arr: [],
      currentNode: '2',
      loading: false,
      totalTime: 0,
      flag: false,
      resetData: {},
      count: 10,
      corp: '',
      corpNames: [],
      editType: '',
      curNode: {},
      data:{
        name: ''
      },
      name:'',
      userInfo: {},
      dayjs: () => {}
    }
  }
}
</script>