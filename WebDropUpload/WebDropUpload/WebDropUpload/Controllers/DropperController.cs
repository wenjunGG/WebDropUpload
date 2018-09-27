using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WebDropUpload.Controllers
{
    public class DropperController : Controller
    {
        // GET: Dropper
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult uploadTarget()
        {
            int a = 1;

            return Content("ssss");
        }
    }
}