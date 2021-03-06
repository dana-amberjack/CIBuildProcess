﻿using System;
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

        [TestMethod]
        public void FailingTest()
        {
            Assert.IsTrue(true,"A Deliberately Failed Test");
        }


        [TestMethod]
        public void ContactReturnsActionResult()
        {
            var controller = new HomeController();

            var result = controller.Contact();

            Assert.IsNotNull(result);
            Assert.IsInstanceOfType(result, typeof(ActionResult));
        }

        [TestMethod]
        public void IndexReturnsActionResult()
        {
            var controller = new HomeController();

            var result = controller.Index();

            Assert.IsNotNull(result);
            Assert.IsInstanceOfType(result, typeof(ActionResult));
        }

    }
}
