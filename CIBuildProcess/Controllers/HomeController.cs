using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using CIBuildProcess.Models;

namespace CIBuildProcess.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            var vm = new HomeViewModel
                     {
                         Environment = ConfigurationManager.AppSettings.Get("Environment"),
                         AppVersion = ConfigurationManager.AppSettings.Get("AppVersion")
                     };

            return View(vm);
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your application description page.";

            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}