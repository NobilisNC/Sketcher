<?php

/* @Twig/Exception/exception_full.html.twig */
class __TwigTemplate_f1d928113d6f1b70aef4d29d728c8fcf701c69499c73ac9ef7b5ed715afd156e extends Twig_Template
{
    public function __construct(Twig_Environment $env)
    {
        parent::__construct($env);

        // line 1
        $this->parent = $this->loadTemplate("@Twig/layout.html.twig", "@Twig/Exception/exception_full.html.twig", 1);
        $this->blocks = array(
            'head' => array($this, 'block_head'),
            'title' => array($this, 'block_title'),
            'body' => array($this, 'block_body'),
        );
    }

    protected function doGetParent(array $context)
    {
        return "@Twig/layout.html.twig";
    }

    protected function doDisplay(array $context, array $blocks = array())
    {
        $__internal_da0ded7f3039a7e678d589873117711b337738add40b8bf66cb1f98fbab20632 = $this->env->getExtension("Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension");
        $__internal_da0ded7f3039a7e678d589873117711b337738add40b8bf66cb1f98fbab20632->enter($__internal_da0ded7f3039a7e678d589873117711b337738add40b8bf66cb1f98fbab20632_prof = new Twig_Profiler_Profile($this->getTemplateName(), "template", "@Twig/Exception/exception_full.html.twig"));

        $this->parent->display($context, array_merge($this->blocks, $blocks));
        
        $__internal_da0ded7f3039a7e678d589873117711b337738add40b8bf66cb1f98fbab20632->leave($__internal_da0ded7f3039a7e678d589873117711b337738add40b8bf66cb1f98fbab20632_prof);

    }

    // line 3
    public function block_head($context, array $blocks = array())
    {
        $__internal_7ec874e97d6af4bbdbe47e6d5d0fb3fa5917628af2e85f79a622d705b849f656 = $this->env->getExtension("Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension");
        $__internal_7ec874e97d6af4bbdbe47e6d5d0fb3fa5917628af2e85f79a622d705b849f656->enter($__internal_7ec874e97d6af4bbdbe47e6d5d0fb3fa5917628af2e85f79a622d705b849f656_prof = new Twig_Profiler_Profile($this->getTemplateName(), "block", "head"));

        // line 4
        echo "    <link href=\"";
        echo twig_escape_filter($this->env, $this->env->getExtension('Symfony\Bridge\Twig\Extension\HttpFoundationExtension')->generateAbsoluteUrl($this->env->getExtension('Symfony\Bridge\Twig\Extension\AssetExtension')->getAssetUrl("bundles/framework/css/exception.css")), "html", null, true);
        echo "\" rel=\"stylesheet\" type=\"text/css\" media=\"all\" />
";
        
        $__internal_7ec874e97d6af4bbdbe47e6d5d0fb3fa5917628af2e85f79a622d705b849f656->leave($__internal_7ec874e97d6af4bbdbe47e6d5d0fb3fa5917628af2e85f79a622d705b849f656_prof);

    }

    // line 7
    public function block_title($context, array $blocks = array())
    {
        $__internal_8c3680b3b09a6ea8296cbe404d077ac91ec4082ca2b682efd276f0c1ed9db231 = $this->env->getExtension("Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension");
        $__internal_8c3680b3b09a6ea8296cbe404d077ac91ec4082ca2b682efd276f0c1ed9db231->enter($__internal_8c3680b3b09a6ea8296cbe404d077ac91ec4082ca2b682efd276f0c1ed9db231_prof = new Twig_Profiler_Profile($this->getTemplateName(), "block", "title"));

        // line 8
        echo "    ";
        echo twig_escape_filter($this->env, $this->getAttribute((isset($context["exception"]) ? $context["exception"] : $this->getContext($context, "exception")), "message", array()), "html", null, true);
        echo " (";
        echo twig_escape_filter($this->env, (isset($context["status_code"]) ? $context["status_code"] : $this->getContext($context, "status_code")), "html", null, true);
        echo " ";
        echo twig_escape_filter($this->env, (isset($context["status_text"]) ? $context["status_text"] : $this->getContext($context, "status_text")), "html", null, true);
        echo ")
";
        
        $__internal_8c3680b3b09a6ea8296cbe404d077ac91ec4082ca2b682efd276f0c1ed9db231->leave($__internal_8c3680b3b09a6ea8296cbe404d077ac91ec4082ca2b682efd276f0c1ed9db231_prof);

    }

    // line 11
    public function block_body($context, array $blocks = array())
    {
        $__internal_e98046bb6610707f34c549271a574c5dbf7d9786c051c5fc5f27218a987153c6 = $this->env->getExtension("Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension");
        $__internal_e98046bb6610707f34c549271a574c5dbf7d9786c051c5fc5f27218a987153c6->enter($__internal_e98046bb6610707f34c549271a574c5dbf7d9786c051c5fc5f27218a987153c6_prof = new Twig_Profiler_Profile($this->getTemplateName(), "block", "body"));

        // line 12
        echo "    ";
        $this->loadTemplate("@Twig/Exception/exception.html.twig", "@Twig/Exception/exception_full.html.twig", 12)->display($context);
        
        $__internal_e98046bb6610707f34c549271a574c5dbf7d9786c051c5fc5f27218a987153c6->leave($__internal_e98046bb6610707f34c549271a574c5dbf7d9786c051c5fc5f27218a987153c6_prof);

    }

    public function getTemplateName()
    {
        return "@Twig/Exception/exception_full.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  78 => 12,  72 => 11,  58 => 8,  52 => 7,  42 => 4,  36 => 3,  11 => 1,);
    }

    public function getSource()
    {
        return "{% extends '@Twig/layout.html.twig' %}

{% block head %}
    <link href=\"{{ absolute_url(asset('bundles/framework/css/exception.css')) }}\" rel=\"stylesheet\" type=\"text/css\" media=\"all\" />
{% endblock %}

{% block title %}
    {{ exception.message }} ({{ status_code }} {{ status_text }})
{% endblock %}

{% block body %}
    {% include '@Twig/Exception/exception.html.twig' %}
{% endblock %}
";
    }
}
