using System;
using System.Web.Mvc;
using CIBuildProcess.Controllers;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace CIBuildProcess.Tests
{
    [TestClass]
    public class HomeControllerTests
    {
        [TestMethod]
        public void AboutReturnsActionResult()
        {
            var controller = new HomeController();

            var result = controller.About();

            Assert.IsNotNull(result);
            Assert.IsInstanceOfType(result, typeof(ActionResult));
        }
    }
}
