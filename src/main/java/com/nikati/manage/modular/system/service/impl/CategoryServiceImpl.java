package com.nikati.manage.modular.system.service.impl;

import cn.stylefeng.roses.core.util.ToolUtil;
import com.nikati.manage.config.properties.GunsProperties;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.ss.formula.functions.T;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.nikati.manage.core.common.node.MenuNode;
import com.nikati.manage.core.common.node.ZTreeNode;
import com.nikati.manage.core.util.Pager;
import com.nikati.manage.modular.system.dao.CategoryMapper;
import com.nikati.manage.modular.system.dao.SiteMapper;
import com.nikati.manage.modular.system.model.Category;
import com.nikati.manage.modular.system.model.Site;
import com.nikati.manage.modular.system.service.BaseService;
import org.springframework.util.ResourceUtils;

import javax.annotation.Resource;
import java.io.File;
import java.io.FileNotFoundException;
import java.util.*;
import java.util.stream.Collectors;

/**
 * @Author jsnjfz
 * @Date 2019/7/21 15:17
 * 分类相关业务接口实现类
 */
@Service
public class CategoryServiceImpl extends BaseService<Category> {

    @Resource
    private CategoryMapper categoryMapper;

    @Resource
    private SiteMapper siteMapper;

    @Resource
    private GunsProperties gunsProperties;

    public static Pager<Category> pager = null;


    public List<Category> getCatogry(Map<String, Object> map) {
        //获取跟目录(绝对路径)
        /*try {
            File path = new File(ResourceUtils.getURL("classpath:").getPath());
            File upload = new File(path.getAbsolutePath(),"static/temp");
            System.out.println("CategoryServiceImpl.getCatogry >>>>>>>>" + upload.getAbsolutePath());
        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        }*/
        System.out.println("uploadPath >>>>>" + gunsProperties.getFileUploadPath());
        return categoryMapper.getCatogry(map);
    }

    public List<MenuNode> getCatogryNode(Map<String, Object> map) {
        return categoryMapper.getCatogryNode(map);
    }

    public List<ZTreeNode> tree() {
        return categoryMapper.tree();
    }


    public List<Category> getCatogrySite(Map<String, Object> map) {
        List<Category> categoryList = categoryMapper.getList(map);
        List<Site> siteList = siteMapper.getList(map);
        for (Category category : categoryList) {
            List<Site> sites = new ArrayList<>();
            for (Site site:siteList){
                if (Objects.equals(site.getCategoryId(), category.getId())){
                    sites.add(site);
                }
            }
            category.setSites(sites);
        }
        // 先获取最顶层级排序
        Integer rootLevel = categoryList.stream().map(Category::getLevels).min(Integer::compareTo).get();
        // 按树展开顺序获取所有菜单,
        return getExpandTreeCategoryList(categoryList, rootLevel);
    }

    /**
     * 按树展开顺序获取所有菜单
     */
    private List<Category> getExpandTreeCategoryList(List<Category> categoryList, Integer rootLevel) {
        if(CollectionUtils.isEmpty(categoryList) || Objects.isNull(rootLevel)){
            return new ArrayList<>(0);
        }
        List<Category> resultList = new ArrayList<>(categoryList.size());
        List<Category> rootCategoryList = categoryList.stream().filter(category-> Objects.equals(category.getLevels(), rootLevel)).collect(Collectors.toList());
        rootCategoryList.forEach(category->{
            resultList.add(category);
            addChildList(category.getId(), categoryList, resultList);
        });
        return resultList;
    }

    private void addChildList(Integer parentId, List<Category> categoryList, List<Category> resultList) {
        List<Category> childList = categoryList.stream().filter(category -> Objects.equals(category.getParentId(), parentId)).collect(Collectors.toList());
        if(CollectionUtils.isNotEmpty(childList)){
            childList.forEach(category ->{
                resultList.add(category);
                addChildList(category.getId(), categoryList, resultList);
            });
        }
    }

    /**
     * 站内查询
     */
    public List<Category> getCatogrySiteByinfo(Map<String, Object> map) {
        List<Category> categoryList = categoryMapper.getList(null);
        List<Category> resultList = new ArrayList<>();
        List<Site> siteList = siteMapper.getList(map);
        if(siteList.size()==0) {
        	return categoryList;
        }
        for (Category category:categoryList) {
            List<Site> sites = new ArrayList<>();
            for (Site site:siteList){
                if (Objects.equals(site.getCategoryId(), category.getId())){
                    sites.add(site);
                }
            }
            if(sites.size()!=0) {
            	category.setSites(sites);
            }
            if(null==category.getSites()||category.getSites().size()==0) {
            }else {
            	resultList.add(category);
            }
        }
        return resultList;
    }


}
