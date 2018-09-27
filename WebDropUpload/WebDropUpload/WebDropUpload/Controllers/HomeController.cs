using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WebDropUpload.Controllers
{
    public class HomeController : Controller
    {
        // GET: Home
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public ActionResult UpLoad(List<UploadItem> dataPullPath)
        {

            //获取files 文件 
            // Request.Files

            //获取其他参数
            //Request.Form["dataPullPath"]

            int i = 1;
            return RedirectToAction("Index");
        }


        public class UploadItem
        {
            public string FullName { get; set; }

            public string FullPath { get; set; }
        }
    }
}