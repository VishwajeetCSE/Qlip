package com.lnctu;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class HelloServlet extends HttpServlet{
	
	
	public void doPost(HttpServletRequest req,HttpServletResponse res) throws IOException
	{
		String n=req.getParameter("name");
		//System.out.println("Hello "+n);
		PrintWriter out= res.getWriter();
		out.println("Hello "+n);
		
	}

}