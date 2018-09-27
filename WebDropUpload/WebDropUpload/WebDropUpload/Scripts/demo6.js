function showModal() { //打开上传框
	var modal = document.getElementById('modal');
	var overlay = document.getElementsByClassName('overlay')[0];
	overlay.style.display = 'block';
	modal.style.display = 'block';
}

function closeModal() { //关闭上传框
	var modal = document.getElementById('modal');
	var overlay = document.getElementsByClassName('overlay')[0];
	overlay.style.display = 'none';
	modal.style.display = 'none';
}
//用DOM2级方法为右上角的叉号和黑色遮罩层添加事件：点击后关闭上传框
document.getElementsByClassName('overlay')[0].addEventListener('click', closeModal, false);
document.getElementById('close').addEventListener('click', closeModal, false);

//利用html5 FormData() API,创建一个接收文件的对象，因为可以多次拖拽，这里采用单例模式创建对象Dragfiles
var Dragfiles = (function () {
	var instance;
	return function () {
		if (!instance) {
			instance = new FormData();
		}
		return instance;
	}
}());
//为Dragfiles添加一个清空所有文件的方法
FormData.prototype.deleteAll = function () {
	var _this = this;
	this.forEach(function (value, key) {
		_this.delete(key);
	})
}

//添加拖拽事件
var dz = document.getElementById('content');
dz.ondragover = function (ev) {
	//阻止浏览器默认打开文件的操作
	ev.preventDefault();
	//拖入文件后边框颜色变红
    this.style.borderColor = 'red';
}

dz.ondragleave = function () {
	//恢复边框颜色
	this.style.borderColor = 'gray';
}
dz.addEventListener("drop", function (ev) {
	//恢复边框颜色
	this.style.borderColor = 'gray';
	//阻止浏览器默认打开文件的操作
    ev.preventDefault();
    
   
    listing=this;
     let items = ev.dataTransfer.items;
     console.log(ev.dataTransfer.files);
     ev.preventDefault();
     listing.innerHTML = "";
     for (let i = 0; i < items.length; i++) {
         let item = items[i].webkitGetAsEntry();
         if (item) {
             scanFiles(item, listing);
         }
     }
    }, false);


   //文件夹列表
   function scanFiles(item, container) {
    if (item.isFile) {
        debugger;
        item.file(function (file) {
            let newForm = Dragfiles(); //获取单例
            newForm.append(item.name, file);
        });
      }

    var elem = document.createElement("li");
    elem.innerHTML = item.name;
    elem.className="li_file";
    elem.setAttribute("fullpath", item.fullPath);
    elem.setAttribute("fullname", item.name);
    container.appendChild(elem);

    if (item.isDirectory) {
        var directoryReader = item.createReader();
        var directoryContainer = document.createElement("ul");
        directoryContainer.className="ul_dir";
        container.appendChild(directoryContainer);

        var fnReadEntries = function (entries) {
            entries.forEach(function (entry) {
                scanFiles(entry, directoryContainer);
            });
            if (entries.length > 0) {
                directoryReader.readEntries(fnReadEntries);
            }
        };

        directoryReader.readEntries(fnReadEntries);
    }
}

function blink() {
	document.getElementById('content').style.borderColor = 'gray';
}

//ajax上传文件
function upload() {
    
    let  data = Dragfiles(); //获取formData
    let dataPullPath=[]; //文件信息
    
    for(let i=0;i<$('.li_file').length;i++){
         let fileCurrent=$($('.li_file')[i]);
         let lifile={
            FullName: fileCurrent.attr('fullname'),
            FullPath: fileCurrent.attr('fullpath')
        }
        dataPullPath.push(lifile);
    }

    data.append('dataPullPath', JSON.stringify(dataPullPath));

	$.ajax({
        url: '/Home/UpLoad',
		type: 'POST',
        data: data,
		async: true,
		cache: false,
		contentType: false,
		processData: false,
		success: function (data) {
			alert('succeed!') //可以替换为自己的方法
			closeModal();
			data.deleteAll(); //清空formData
			$('.tbody').empty(); //清空列表
		},
		error: function (returndata) {
			alert('failed!') //可以替换为自己的方法
		}
	});
}
// 用事件委托的方法为‘删除’添加点击事件，使用jquery中的on方法
$(".tbody").on('click', 'tr td:last-child', function () {
	//删除拖拽框已有的文件
	var temp = Dragfiles();
	var key = $(this).prev().prev().prev().text();
	console.log(key);
	temp.delete(key);
	$(this).parent().remove();
});


//清空所有内容
function clearAll() {
    
    var data = Dragfiles();
    data.deleteAll(); //清空formData
    document.getElementById('content').innerHTML = '';
}

//上传工具
var UploadTool = {
	SpiltFileName: function (FileName, len) {
		let FileNamlength = FileName.length;
		if (FileNamlength <= len) {
			return FileName;
		} else {
			return FileName.substring(len - 3, FileNamlength.length - len) + '...';
		}
	}
}

//文件上传
var UploadModule = {
	currentPath:'\\',
	Init: function () {
		//初始化绑定事件
        this.bingEvents();
		//获取数据
		let data = this.getInfo(1);
		 //文件算法
	    let	FileArr=this.currentDirAlgorithm(this.currentPath,data);
		//显示文件
		let doubleCliDirbo=this.displayFile(FileArr);
		//双击文件夹
		if(doubleCliDirbo) this.doubleClickFile();
	},
	//获取文件目录
	getInfo: function (FileID) {
		var json = [{
				"PhyDir": "",
				"FileGUID": "59a6b39e-eeee-4c42-91dd-085efd31b99c",
				"FileName": "QQ截图20180820142118.png",
				"UploadTime": "2018-09-07 14:22:25",
				"VirtualDir": "\\Img\\",
				"UserName": "管理员"
			},
			{
				"PhyDir": "",
				"FileGUID": "63c3263e-75d4-4cb2-91c7-a1694803edb9",
				"FileName": "statok.png",
				"UploadTime": "2018-09-07 14:22:25",
				"VirtualDir": "\\Img\\",
				"UserName": "管理员"
			},
			{
				"PhyDir": "",
				"FileGUID": "8656f9ea-1ccd-4e6b-ba21-3fbc1b60104f",
				"FileName": "QQ截图20180828135157.png",
				"UploadTime": "2018-09-07 13:52:55",
				"VirtualDir": "\\",
				"UserName": "管理员"
			},
			{
				"PhyDir": "",
				"FileGUID": "8e889ff0-daa4-4353-9519-f6509b564cb5",
				"FileName": "QQ截图20180820143014.png",
				"UploadTime": "2018-09-07 14:22:25",
				"VirtualDir": "\\Img\\",
				"UserName": "管理员"
			},
			{
				"PhyDir": "",
				"FileGUID": "a0852270-e536-4088-838a-103b4de89488",
				"FileName": "statcurrent.png",
				"UploadTime": "2018-09-07 14:22:25",
				"VirtualDir": "\\Img\\",
				"UserName": "管理员"
			},
			{
				"PhyDir": "",
				"FileGUID": "14c80697-6cbc-4d2d-a4a8-3b1b372d9102",
				"FileName": "st.txt",
				"UploadTime": "2018-09-07 14:22:25",
				"VirtualDir": "\\Img\\ss\\",
				"UserName": "管理员"
			}
		];
		return json;
	},
	//文件上传
	uploadFile: function () {
		upload();
	},
	//下载单个文件
	downSimgleFile: function () {

	},
	//下载所有文件
	downAllFile: function () {

	},
	//返回上一级
	returnBack: function () {
		let data = this.getInfo(1);
		//判断是否是根目录
		if(this.currentPath==""||this.currentPath=="\\") return;
		
		//找到前面一个路径
		var pathUrl='\\';
		let pathArr=this.currentPath.split('\\');
		for(let i=0;i<pathArr.length-2;i++){
			if(i!=pathArr.length-1){
				if(pathArr[i]!='')
				pathUrl=pathUrl+pathArr[i]+"\\";
			}
		}
		let FileArr=this.currentDirAlgorithm(pathUrl,data);
		//显示文件
		let doubleCliDirbo=this.displayFile(FileArr);
		//双击文件夹
		if(doubleCliDirbo)this.doubleClickFile();
		//修改当前路径
        this.currentPath=pathUrl;
	},
	//删除
	deleteFile: function () {

	},
	//双击文件夹
	doubleClickFile: function () {
		document.getElementById('doubleCliDir').addEventListener("dblclick", function (e) {
			let el = e || window.event;
			if (el.target.tagName.toLowerCase() == "img") {
				UploadModule.currentPath=$(el.target).attr('data_id');
				let data = UploadModule.getInfo(1);
				let FileArr=UploadModule.currentDirAlgorithm(UploadModule.currentPath,data);
				//显示文件
				let doubleCliDirbo=UploadModule.displayFile(FileArr);
				//双击文件夹
				if(doubleCliDirbo)UploadModule.doubleClickFile();
			}
		});
	},
	//当前文件夹下的算法
	currentDirAlgorithm: function (dirpath,data) {
		let FileArr = [];
			for (let item of data) {
				let virdirName = item.VirtualDir;
				if(virdirName.indexOf(dirpath)>=0){
					//添加文件
				if (virdirName == dirpath) {
					let fileobj = {
						FileGUID: item.FileGUID,
						FileName: item.FileName,
						VirtualDir:item.VirtualDir
					};
					FileArr.push(fileobj)
				} else {
					//添加文件夹
					let fileDirName = virdirName.split(dirpath)[1].replace('\\','');
					let IsExistBo = false;
					for (let it of FileArr) {
						if (it.FileName == fileDirName) {
							IsExistBo = true;
							break;
						}
					}
					if (IsExistBo) continue;
					let fileobj = {
						FileGUID: '',
						FileName: fileDirName,
						VirtualDir:virdirName
					};
					FileArr.push(fileobj)
				}
			 }
		}
        return FileArr;
	},
	//设置文件夹目录的显示
	displayFile: function (FileArr) {
		let html = '';
		//是否有文件夹，需要进行展示
		let doubleCliDirbo=false;
		
		for (let item of FileArr) {
			if (item.FileGUID == "") {
				//文件夹
				html = html + ' <li><a href="javascript:" id="doubleCliDir"><img src="Img/Folder.png" data_id="'+item.VirtualDir+'"><div style="display: flex;"><input type="checkbox" data_type="dir" data_id="'+item.VirtualDir+'"><span class="name">' + UploadTool.SpiltFileName(item.FileName, 7) + '</span></div><i class="check"></i>' +
					'</a></li>';
			  doubleCliDirbo=true;	
			} else {
				html = html + ' <li><a href="javascript:"><img src="Img/File.png"><div style="display: flex;"><input type="checkbox" data_type="file" data_id="'+item.FileGUID+'"><span class="name">' + UploadTool.SpiltFileName(item.FileName, 7) + '</span></div><i class="check"></i>' +
					'</a></li>';
			}
		}
		$(".upload_content_ul").empty();
		$(".upload_content_ul").append(html);

		return doubleCliDirbo;
	},
	//绑定绑定事件
	bingEvents:function(){
		//绑定返回
       $("#FileBack").click(function(){
		    UploadModule.returnBack();
	   })
	}
}

UploadModule.Init();