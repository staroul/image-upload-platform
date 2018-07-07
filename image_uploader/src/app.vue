<template>
    <div class="uploader">
        <Layout>
            <Header class="header">
                <div class="header-center">
                    <Icon class="icon" type="upload" size="60"/>
                    <h1>图片上传服务</h1>
                </div>
            </Header>
            <Layout class="container"> 
                <Sider class="sider" width="390">
                    <Card>
                        <Upload
                            class="upload-frame"
                            ref="upload"
                            multiple
                            type="drag"
                            name="images"
                            action="http://127.0.0.1:3000/upload"
                            :show-upload-list="false"
                            :format="['jpg','jpeg','png','gif']"
                            :max-size="10240"
                            :default-file-list="defaultList"
                            :before-upload="handleBeforeUpload"
                            :on-success="handleSuccess"
                            :on-erroe="handleError"
                            :on-format-error="handleFormatError"
                            :on-exceeded-size="handleMaxSize"
                            :style="{height: '90%'}">
                            <div class="upload-button">
                                <div class="upload-info">
                                    <Icon class="upload-icon" type="ios-cloud-upload-outline" size="80"/>
                                    <p><em>选择</em>文件或<em>拖拽</em>文件到这里（支持批量上传。目前仅支持 gif、jpg、png 格式的图片文件）</p>
                                </div>
                            </div>
                        </Upload>
                        <div class="upload-hint">
                            <Checkbox size="large" v-model="keepName">保持原名（原名需为英文、数字、下划线、中划线）</Checkbox>
                        </div>
                    </Card>
                </Sider>
                <Content class="content">
                    <Card class="card">
                        <div class="upload-list" v-for="item in uploadList">
                            <template v-if="item.status === 'finished'">
                                <div class='upload-image'>
                                    <img :src="item.url">
                                </div>
                                <Input class='upload-url' v-model="item.url" size='small' readonly style="width: 97%"></Input>
                                <div class="upload-list-cover">
                                    <div class="upload-list-cover-button">
                                        <Icon type="ios-search-strong" size="30" @click.native="handleView(item)"></Icon>
                                        <Icon type="ios-copy" size="30"  v-clipboard:copy="item.url" @click.native="handleCopy(item)"></Icon>
                                        <Icon type="trash-b" size="30" @click.native="handleRemove(item)"></Icon>
                                    </div>
                                </div>
                                
                            </template>
                            <template v-else>
                                <Progress class="upload-progress" status="active" v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                            </template>
                         </div>
                    </Card>
                </Content>
                <Modal class="upload-modal" title="图片预览" v-model="visible">
                    <img :src="uploadList[imgIndex].url" v-if="visible">
                    <div slot="footer">
                        <i-button type="text" size="large" @click="handleCancel(imgIndex)">删除</i-button>
                        <i-button type="primary" size="large" @click="handleOK()">确定</i-button>
                    </div>
                </Modal>
            </Layout>
            <Footer class="footer-center">2018 &copy; Merlynli</Footer>
        </Layout>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                defaultList: [
                    {
                        'name': 'a42bdcc1178e62b4694c830f028db5c0',
                        'url': 'https://o5wwk8baw.qnssl.com/a42bdcc1178e62b4694c830f028db5c0/avatar'
                    },
                    {
                        'name': 'bc7521e033abdd1e92222d733590f104',
                        'url': 'https://o5wwk8baw.qnssl.com/bc7521e033abdd1e92222d733590f104/avatar'
                    }
                ],
                imgName: '',
                imgIndex: 0,
                visible: false,
                uploadList: [],
                keepName: false
            }
        },
        methods: {
            handleView (file) {
                const fileList = this.$refs.upload.fileList;
                this.imgName = file.name;
                this.imgIndex = fileList.indexOf(file);
                this.visible = true;
            },
            handleCopy (file) {
                this.$Notice.success({
                    title: '复制已链接',
                    desc: '链接已经复制至粘贴板'
                });
            },
            handleRemove (file) {
                const fileList = this.$refs.upload.fileList;
                this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
            },
            handleCancel (index) {
                const fileList = this.$refs.upload.fileList;
                this.$refs.upload.fileList.splice(index, 1);
                this.visible = false;
            },
            handleOK () {
                this.visible = false;
            },
            handleBeforeUpload () {
                console.log(this.keepName);
            },
            handleSuccess (res, file) {
                file.name = res['name'];
                file.url = res['path'];
            },
            handleError (file){
                this.$Notice.warning({
                    title: '上传失败',
                    desc: file.name + '上传失败，请检查网络状况后重试'
                });
            },
            handleFormatError (file) {
                this.$Notice.warning({
                    title: '文件格式错误',
                    desc: file.name + '文件格式有误，目前仅支持jpg, jpeg, png'
                });
            },
            handleMaxSize (file) {
                this.$Notice.warning({
                    title: '文件过大',
                    desc: file.name + '文件过大，目前仅支持10M以下文件'
                });
            }
        },
        mounted(){
            this.uploadList = this.$refs.upload.fileList;
        }
    }
</script>

<style scoped>
@import "./assets/css/style.css";

.header{
    display: flex;
    flex-direction: column;
    width: 100%;
    min-width: 330px;
    background: #fff;
    box-shadow: 0 2px 3px 2px rgba(0,0,0,.1);
    margin-bottom: 20px;
    z-index: 1;
}
.sider{
    background: #fff;
    margin: 0px 0 20px 0;
    max-height: 600px;
}

</style>