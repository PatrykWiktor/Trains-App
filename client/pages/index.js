import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from 'next/link'

function index() {

  return (
    <div>
      <Link href="/station">Stations</Link>
      <br/>
      <Link href="/route">Routes</Link>
      <br/>
      <Link href="/car">Cars</Link>
      <br/>
      <Link href="/train">Trains</Link>
      <br/>
      <Link href="/ticket/create">Ticket / Create</Link>
      <br/>
      <Link href="/run">RUN</Link>
      <br/>
    </div>
  );
}

export default index;
