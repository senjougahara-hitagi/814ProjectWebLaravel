<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class products extends Model
{
    //
    public static function get52Products()
    {
        $query = $query = DB::table('products')->leftJoin('productimages','products.ProductID','=','productimages.ImageProductId')->get();
        return $query;
    }

    public static function getAllCategory()
    {
        $query = DB::table("productcategories")->get();
        return $query;
    }

    public static function get52ProducsOrderBySmallToBig()
    {
        $query = DB::table('products')->leftJoin('productimages','products.ProductID','=','productimages.ImageProductId')->orderBy('ProductPrice')->limit(52)->get();
        return $query;
    }

    public static function get52ProducsOrderByBigToSmall()
    {
        $query = DB::table('products')->leftJoin('productimages','products.ProductID','=','productimages.ImageProductId')->orderBy('ProductPrice','desc')->limit(52)->get();
        return $query;
    }
}
